import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, SignUpData, SignInData } from '../types/auth';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signUp = async (data: SignUpData): Promise<void> => {
    const response = await authService.signUp(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const signIn = async (data: SignInData): Promise<void> => {
    const response = await authService.signIn(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const signOut = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
