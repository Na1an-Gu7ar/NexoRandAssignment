import { createContext, useState, useEffect } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

// AuthContextProvider to wrap the app
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check localStorage for a logged-in user
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(storedUser);
        }
    }, []);

    // Login function
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
