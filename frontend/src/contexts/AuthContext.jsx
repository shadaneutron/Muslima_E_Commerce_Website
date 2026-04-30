import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : null);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://127.0.0.1:8080/api/users/login/', {
        username: email,
        password: password,
      });
      setUser(data);
      setToken(data.access);
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.access);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || "خطأ في الدخول" };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post('http://127.0.0.1:8080/api/users/register/', {
        name: name,
        email: email,
        password: password,
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: "هذا الإيميل مستخدم بالفعل" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);