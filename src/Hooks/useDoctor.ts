import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  specialite: string;
  email: string;
  phone: string;
  image: string;
  biography: string;
  status: string;
}

export const useDoctor = (doctorId: string) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getAccessToken } = useAuth(); // Utilisation correcte maintenant

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/medecin/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctor");
        }

        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId, getAccessToken]);

  return { doctor, loading, error };
};