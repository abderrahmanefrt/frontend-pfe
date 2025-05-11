// src/hooks/useRefreshToken.ts
import { useAuth } from "../context/AuthContext";

const useRefreshToken = () => {
  const { user, updateUser } = useAuth();

  const refresh = async () => {
    try {
      const res = await fetch("https://pfe-project-2nrq.onrender.com/api/auth/refresh-token", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Échec du refresh");

      const data = await res.json();

      const newUser = {
        ...user!,
        accessToken: data.accessToken,
      };

      updateUser(newUser);
      return data.accessToken;
    } catch (err) {
      console.error("Erreur de refresh token :", err);
      return "";
    }
  };

  return refresh;
};

export default useRefreshToken;
