import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const RefreshToken: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch("https://pfe-project-2nrq.onrender.com/api/auth/refresh-token/", {
          method: "POST",
          credentials: "include", // Cela inclut les cookies dans la requête
        });

        // Vérifier que la réponse est correcte
        if (!response.ok) {
          throw new Error("Erreur lors du rafraîchissement du token");
        }

        const data = await response.json();
        console.log("Réponse API:", data); // Affiche la réponse pour vérifier

        if (!data.accessToken || !data.email) {
          throw new Error("Les données reçues sont incomplètes.");
        }

        // Si tout est bon, connecter l'utilisateur avec les nouvelles données
        login({
          id: data.id,
          role: data.role, // Vérifier si 'role' est nécessaire
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone ?? "",
          specialite: data.specialite ?? "",
          accessToken: data.accessToken, // Nouvel access token reçu
        });
      } catch (err: any) {
        console.error("Erreur de rafraîchissement:", err.message);
        setError("Impossible de rafraîchir le token"); // Afficher l'erreur dans le UI
        logout(); // Déconnecte l'utilisateur si une erreur se produit
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    // Rafraîchir le token uniquement si l'utilisateur n'a pas encore de token
    if (!user?.accessToken) {
      refreshAccessToken();  // Rafraîchit le token si nécessaire
    } else {
      setLoading(false);  // Si l'utilisateur a un token valide, arrête le chargement
    }
  }, [user, login, logout]);

  if (loading) return <div>Rafraîchissement en cours...</div>; // Affiche un message de chargement
  if (error) return <div className="alert alert-danger">{error}</div>; // Affiche l'erreur

  return <div>Token rafraîchi avec succès !</div>; // Message de succès
};

export default RefreshToken;
