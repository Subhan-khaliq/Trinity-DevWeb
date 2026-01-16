import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Assuming there's a verify endpoint or just using stored user data? 
                    // For now we'll decode the token or fetch profile if needed.
                    // Let's assume we store user info in localStorage for simplicity or fetch it.
                    // Better: Fetch user profile on load.
                    // Endpoint: GET /api/users/profile (hypothetical) or similar.
                    // If not available, we might just assume valid session until a 401 happens.
                    // Let's try to fetch user details.
                    /* 
                    const { data } = await api.get('/users/profile');
                    setUser(data);
                    */
                    // Fallback: If we have a token, we consider them logged in until proven otherwise.
                    // We can store generic user info in localStorage on login.
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error("Auth verification failed", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        // Adjust endpoint based on backend routes
        // backend/src/routes/auth.routes.js -> likely POST /login or /signup
        // Let's assume POST /auth/login based on common patterns, will verify later.
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
