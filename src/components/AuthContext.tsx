// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }:any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => localStorage.getItem('isAuthenticated') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('isAuthenticated', String(isAuthenticated));
    }, [isAuthenticated]);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
