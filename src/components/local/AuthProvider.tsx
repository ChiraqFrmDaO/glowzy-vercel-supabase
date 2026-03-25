import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser, getUserByEmail, initializeDatabase } from '@/integrations/local/client';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, username?: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize database
    initializeDatabase();
    
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('localUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, username?: string) => {
    try {
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const newUser = createUser(email, username);
      setUser(newUser);
      localStorage.setItem('localUser', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string) => {
    try {
      const existingUser = getUserByEmail(email);
      if (!existingUser) {
        throw new Error('User not found');
      }
      
      setUser(existingUser);
      localStorage.setItem('localUser', JSON.stringify(existingUser));
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('localUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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
