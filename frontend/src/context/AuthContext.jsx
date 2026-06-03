import { createContext, useState, useEffect } from "react";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
       
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            
            axios.get('/api/v1/auth/profile')
                .then(res => {
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                })
                .catch(() => {
                    
                    console.log("Profile route not found or token expired. Using local session data.");
                });
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    
    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('/api/v1/auth/login', { email, password });

            
            const tokenData = response.data.token;
            const userData = response.data.user || response.data;

            setToken(tokenData);
            setUser(userData);

            localStorage.setItem('token', tokenData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Manually force headers for the immediate subsequent fetch
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    
    const registerUser = async (name, email, password, role) => {
        try {
            const response = await axios.post('/api/v1/auth/register', { name, email, password, role });

            const tokenData = response.data.token;
            const userData = response.data.user || response.data;

            setToken(tokenData);
            setUser(userData);

            localStorage.setItem('token', tokenData);
            localStorage.setItem('user', JSON.stringify(userData));

            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    
    const logoutUser = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}