import React, { createContext, useContext, useEffect, useState } from "react";

// Typage de l'utilisateur
interface User {
  id: string;
  role: "patient" | "doctor" | "admin";
  accessToken: string;
  firstname: string;
  lastname: string;
  specialite?: string; // Rendre optionnel
  email: string;
  phone?: string; // Rendre optionnel
  image?: string;
  biography?: string;
  refreshToken?: string; // Ajouter si nécessaire
}

// ... autres imports
interface AuthContextType {
  user: User | null;
  loading: boolean; // <-- ajouter loading
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // <== nouveau state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // <== fini de charger
  }, []);

  const login = (userData: User) => {
    const user = {
      ...userData,
      phone: userData.phone || "",
      specialite: userData.specialite || "",
    };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

