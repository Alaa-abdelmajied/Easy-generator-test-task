export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
}

