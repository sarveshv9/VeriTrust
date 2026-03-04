import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Restore session from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("veritrust_token");
        const savedUser = localStorage.getItem("veritrust_user");

        if (savedToken) {
            setToken(savedToken);
        }
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                // Corrupted user data — ignore
            }
        }
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem("veritrust_token", newToken);
        localStorage.setItem("veritrust_user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("veritrust_token");
        localStorage.removeItem("veritrust_user");
        setToken(null);
        setUser(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
