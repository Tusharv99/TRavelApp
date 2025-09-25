import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (userData: any) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // For React Native, we'll use AsyncStorage simulation
        // In a real app, you'd use @react-native-async-storage/async-storage
        const userData = getUserDataFromStorage();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log('No user data found');
      } finally {
        setIsAppReady(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Simulate storage functions (replace with AsyncStorage in real app)
  const getUserDataFromStorage = (): User | null => {
    try {
      // This is a simulation - in real app, use AsyncStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const setUserDataToStorage = (userData: User) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to save user data');
    }
  };

  const setCredentialsToStorage = (email: string, password: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userCredentials', JSON.stringify({ email, password }));
      }
    } catch (error) {
      console.error('Failed to save credentials');
    }
  };

  const clearStorage = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('userData');
        localStorage.removeItem('userCredentials');
      }
    } catch (error) {
      console.error('Failed to clear storage');
    }
  };

  const signup = (userData: any): boolean => {
    try {
      const newUser = {
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber
      };
      
      setUserDataToStorage(newUser);
      setCredentialsToStorage(userData.email, userData.password);
      setUser(newUser);
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = (email: string, password: string): boolean => {
    try {
      // Simulate credential check
      if (typeof window !== 'undefined' && window.localStorage) {
        const credentials = localStorage.getItem('userCredentials');
        if (!credentials) return false;

        const userCreds = JSON.parse(credentials);
        
        if (userCreds.email === email && userCreds.password === password) {
          const userData = getUserDataFromStorage();
          if (userData) {
            setUser(userData);
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    clearStorage();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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