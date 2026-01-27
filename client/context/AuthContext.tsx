import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../lib/query-client';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  coins: number;
  trophies: number;
  awards: number;
  subscriptionTier: string;
  bio?: string;
  location?: string;
  isVendor: boolean;
  createdAt: string;
  dailySpinsLeft?: number;
  lastSpinDate?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = getApiUrl();

  const loadStoredAuth = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        const response = await fetch(new URL('/api/auth/me', apiUrl).toString(), {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setToken(storedToken);
        } else {
          await AsyncStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(new URL('/api/auth/login', apiUrl).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      await AsyncStorage.setItem('auth_token', data.token);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (registerData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(new URL('/api/auth/register', apiUrl).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      await AsyncStorage.setItem('auth_token', data.token);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await fetch(new URL('/api/auth/me', apiUrl).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
