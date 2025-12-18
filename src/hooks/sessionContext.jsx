import React from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const SessionContext = createContext(null);

const TOKEN_KEY = "token";

const storage = window.sessionStorage;

function readToken() {
    try {
        return storage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function SessionProvider({ children }) {
    const [token, setToken] = useState(() => readToken());


    const login = useCallback((newToken) => {   //  Kesira referencu na metodu, poziva se jednom kad se ovaj context napravi
        try {
            storage.setItem(TOKEN_KEY, newToken);
        } finally {
            setToken(newToken);
        }
    }, []);


    const logout = useCallback(() => {
        try {
            storage.removeItem(TOKEN_KEY);
            window.localStorage.removeItem(TOKEN_KEY);  //  just in case
        } finally {
            setToken(null);
        }
    }, []);


    const isAuthenticated = !!token;

    const user = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);

    const value = useMemo(
        () => ({ token, user, isAuthenticated, login, logout }),    //  Napravi ovaj objekat kada se token, user, isAuthenticated promene i login ili logout dese
        [token, user, isAuthenticated, login, logout]
    );

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within a SessionProvider");
    return ctx;
}