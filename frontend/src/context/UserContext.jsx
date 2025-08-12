// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [cookies] = useCookies(['cookie']);

  useEffect(() => {
    if (cookies.cookie) {
      try {
        const decoded = jwtDecode(cookies.cookie);
        setUserId(decoded.user_id);
        console.log("Rehydrated userId:", decoded.user_id);
      } catch (error) {
        console.error("Invalid token in cookie:", error);
      }
    }
  }, [cookies]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
