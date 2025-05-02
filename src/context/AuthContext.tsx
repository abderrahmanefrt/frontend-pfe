import React, { createContext, useContext, useState, ReactNode } from "react";
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
   // We can add additional fields (e.g., role) as needed.
}
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  signup: (user: User, password: string, extraData?: Record<string, any>) => void;
}

// Create a context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider wraps your application and provides the authentication state.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 'user' holds the currently logged in user's name, or null if not logged in.
  const [user, setUser] = useState<User | null>(null);

  // 'login' function sets the 'user' state to the provided username.
  const login = (user: User) => {
    setUser(user);
   // localStorage.setItem("authToken", "your-token-or-true");
  };

  // 'logout' function clears the 'user' state.
  const logout = () => {
    setUser(null);
    //localStorage.removeItem("authToken");
  };
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };
  // The signup function registers a new user.
  // In a real application, this would call our backend API to create a new account.
  // The extraData parameter can be used for role-specific information (e.g., specialty, license number for doctors).
  const signup = (
    newUser: User,
    password: string,
    extraData?: Record<string, any>
  ) => {
    // Example: Log the sign-up details for demonstration purposes.
    console.log("Signing up user:", newUser, "with password:", password, extraData);
    
    // In a real application, send a POST request to your signup endpoint here.
    // For now, we simply set the user state.
    setUser(newUser);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout ,updateUser, signup}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the authentication context.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
