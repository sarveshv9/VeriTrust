import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("veritrust_token"));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("veritrust_user");
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                return null;
            }
        }
        return null;
    });

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
