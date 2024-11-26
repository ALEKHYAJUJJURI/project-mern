
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const UserContext = createContext();


export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to provide context values to the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user details here
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  useEffect(() => {
    // On mount, check if the user is authenticated via token (using context itself)
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth'); // You can implement this route in your backend
        if (response.data.isAuthenticated) {
          setUser(response.data.user);  // Set user if authenticated
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log("Error checking authentication:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);  // Set user info
    setIsAuthenticated(true);  // Set authentication to true
  };

  // Logout function
  const logout = () => {
    setUser(null);  // Clear user info
    setIsAuthenticated(false);  // Set authentication to false
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
