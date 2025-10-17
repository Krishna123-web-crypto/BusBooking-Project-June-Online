import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // User object { name, email, phone, role }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data from localStorage when app starts
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Login function
  const login = (account) => {
    // account = { name, email, phone, role }
    setUser({ ...account });
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(account));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  // Provide context values to all children
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
