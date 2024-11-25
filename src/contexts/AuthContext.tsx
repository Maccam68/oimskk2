import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType extends AuthState {
  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
  createUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_USER: User = {
  id: 1,
  username: 'Maccam68',
  pin: '13121',
  role: 'admin',
  name: 'Master Admin',
  email: 'admin@example.com'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', [MASTER_USER]);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true
      });
    }
  }, []);

  const login = async (username: string, pin: string): Promise<boolean> => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.pin === pin);
    
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      setAuthState({
        user: updatedUser,
        isAuthenticated: true
      });
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('currentUser');
  };

  const createUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Math.max(0, ...users.map(u => u.id)) + 1
    };
    setUsers([...users, user]);
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      createUser,
      updateUser,
      deleteUser,
      users
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};