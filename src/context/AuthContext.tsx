import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  role: "admin" | "medecin" | "user";
  specialite?: string;
  image?: string;
  biography?: string;
  accessToken: string;
  refreshToken: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  getAccessToken: () => string;
  loading: boolean;
  signup: (userData: any) => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    () => JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string, rememberMe = false): Promise<User> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Login error response:', errorData);  // Log the error response
        throw new Error(errorData.message || "Login failed");
      }
  
      const user = await response.json();
  
      const loggedInUser: User = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        phone: user.phone,
        specialite: user.specialite,
        image: user.image,
        biography: user.biography,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        dateOfBirth: user.dateOfBirth,
      };
  
      setUser(loggedInUser);
      if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.removeItem("user");
      }
  
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "medecin") {
        navigate("/doctor/dashboard");
      } else if (user.role === "user") {
        navigate("/dashboard");
      }
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);  // Log the error
      throw error;  // Re-throw the error to be handled by the component
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      const newUser = { ...(prevUser || {}), ...userData } as User;
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const getAccessToken = () => {
    return user ? user.accessToken : "";
  };

  const signup = async (userData: any): Promise<User> => {
    // Implementation of signup function
    // This is a placeholder and should be replaced with the actual implementation
    throw new Error("Signup function not implemented");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, getAccessToken, loading, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
