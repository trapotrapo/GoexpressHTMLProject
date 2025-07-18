import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface UpdateUserProfile {
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: UpdateUserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    // Note: User authentication is now session-based only
    // No localStorage persistence to maintain security
    console.log('🔐 Authentication system initialized (session-based)');
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Real authentication with specific credentials
    if (username === 'admin1' && password === 'Password007') {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Administrator',
        email: 'admin1@shipco.com',
        phone: '+1 (555) 123-4567',
        role: 'admin'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      // Note: No localStorage - session-based authentication only
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Note: No localStorage cleanup needed
  };

  const updateUserProfile = async (data: UpdateUserProfile): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    
    setUser(updatedUser);
    // Note: User data updated in session only
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};