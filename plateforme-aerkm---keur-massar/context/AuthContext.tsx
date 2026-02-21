import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface RegisterResponse {
  success: boolean;
  errors?: Record<string, string>;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerStudent: (data: any) => Promise<RegisterResponse>;
  updateSessionUser: (userData: User) => void;
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
    try {
      const token = localStorage.getItem('aerkm_token');
      const savedUser = localStorage.getItem('aerkm_user');
      
      if (token && savedUser && savedUser !== "undefined" && savedUser !== "null") {
        setState({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      localStorage.removeItem('aerkm_user');
      localStorage.removeItem('aerkm_token');
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
      
      if (data.token && data.user) {
        localStorage.setItem('aerkm_token', data.token);
        localStorage.setItem('aerkm_user', JSON.stringify(data.user));
        setState({ user: data.user, isAuthenticated: true, loading: false });
        return true;
      }
      return false;
    } catch (err) { 
      console.error("Login error:", err);
      return false; 
    }
  };

  const logout = () => {
    localStorage.removeItem('aerkm_token');
    localStorage.removeItem('aerkm_user');
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const registerStudent = async (data: any): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 400 || response.status === 409) {
        return { success: false, errors: result.errors };
      }

      if (!response.ok) return { success: false };

      if (result.token && result.user) {
        localStorage.setItem('aerkm_token', result.token);
        localStorage.setItem('aerkm_user', JSON.stringify(result.user));
        setState({ user: result.user, isAuthenticated: true, loading: false });
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false };
    }
  };

  const updateSessionUser = (userData: User) => {
    if (userData) {
      localStorage.setItem('aerkm_user', JSON.stringify(userData));
      setState(prev => ({ ...prev, user: userData }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, registerStudent, updateSessionUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};