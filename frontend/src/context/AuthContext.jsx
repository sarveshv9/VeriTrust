import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

// ─── WebCrypto Signing Utility ──────────────────────────────────────────────
// Converts a PEM private key string to a CryptoKey and signs the payload.
// Uses RSASSA-PKCS1-v1_5 + SHA-256 — matches Node.js crypto.createSign('SHA256')
async function rsaSign(privateKeyPem, payloadObj) {
    const canonicalString = JSON.stringify(payloadObj);
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalString);

    // Strip PEM headers and decode base64 → ArrayBuffer
    const pemBody = privateKeyPem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\s+/g, "");
    const binaryStr = atob(pemBody);
    const binaryDer = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        binaryDer[i] = binaryStr.charCodeAt(i);
    }

    const cryptoKey = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signatureBuffer = await window.crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        data
    );

    // Convert to base64 for transport
    const signatureArray = new Uint8Array(signatureBuffer);
    let binaryResult = "";
    signatureArray.forEach(b => { binaryResult += String.fromCharCode(b); });
    return btoa(binaryResult);
}

// ─── AuthProvider ────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("veritrust_token"));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("veritrust_user");
        if (savedUser) {
            try { return JSON.parse(savedUser); } catch { return null; }
        }
        return null;
    });

    // Private key lives ONLY in React state — cleared on logout, never persisted
    const [sessionPrivateKey, setSessionPrivateKey] = useState(null);

    const login = (newToken, userData) => {
        localStorage.setItem("veritrust_token", newToken);
        localStorage.setItem("veritrust_user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const setSessionKey = (pem) => {
        setSessionPrivateKey(pem);
    };

    const logout = () => {
        localStorage.removeItem("veritrust_token");
        localStorage.removeItem("veritrust_user");
        setToken(null);
        setUser(null);
        setSessionPrivateKey(null); // wipe key from memory
    };

    // Returns { signature, timestamp } or null if no key in session
    const signPayload = useCallback(async (payloadObj) => {
        if (!sessionPrivateKey) return null;
        try {
            const timestamp = Date.now();
            const payloadWithTs = { ...payloadObj, timestamp };
            const signature = await rsaSign(sessionPrivateKey, payloadWithTs);
            return { signature, timestamp };
        } catch (err) {
            console.warn("Signing failed:", err);
            return null;
        }
    }, [sessionPrivateKey]);

    const isLoggedIn = !!token;
    const hasSessionKey = !!sessionPrivateKey;

    return (
        <AuthContext.Provider value={{
            token, user, isLoggedIn, login, logout,
            setSessionKey, signPayload, hasSessionKey,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export default AuthContext;

