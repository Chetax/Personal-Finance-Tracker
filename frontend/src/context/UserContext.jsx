// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [cookies] = useCookies(['cookie']);
   const navigate=useNavigate();
  useEffect(() => {
    const token = cookies.cookie
  if (!token || token === "undefined") {
    navigate('/login', { replace: true });
    return;
  }
    if (cookies.cookie) {
      try {
        const decoded = jwtDecode(cookies.cookie);
        setUserId(decoded.user_id);
        console.log("Rehydrated userId:", decoded.user_id);
      } catch (error) {
        console.error("Invalid token in cookie:", error);
      }
    }
    else 
      navigate('/login')
  }, [cookies]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
