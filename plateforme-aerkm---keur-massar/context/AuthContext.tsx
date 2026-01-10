
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerStudent: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://aerkm.onrender.com/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('aerkm_token');
    const savedUser = localStorage.getItem('aerkm_user');
    if (token && savedUser) {
      setState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('aerkm_token', data.token);
      localStorage.setItem('aerkm_user', JSON.stringify(data.user));
      
      setState({ user: data.user, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('aerkm_token');
    localStorage.removeItem('aerkm_user');
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const registerStudent = async (data: any): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) return false;

      const result = await response.json();
      localStorage.setItem('aerkm_token', result.token);
      localStorage.setItem('aerkm_user', JSON.stringify(result.user));
      
      setState({ user: result.user, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, registerStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
