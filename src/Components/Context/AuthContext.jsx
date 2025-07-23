import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const userData = localStorage.getItem("user");
    if (loggedIn && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser({ email: userData });
      }
      setIsLoggedIn(true);
    }
  }, []);
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
