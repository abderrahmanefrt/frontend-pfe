import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { format, parseISO, isAfter } from "date-fns";

const RescheduleAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    time: "",
    availabilityId: ""
  });
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [loading, setLoading] = useState({
    appointment: true,
    availabilities: true
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Charger les détails du rendez-vous
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Impossible de charger le rendez-vous");
        }

        const data = await response.json();
        const appointment = data.appointment || data;
        
        setCurrentAppointment(appointment);
        setFormData({
          time: appointment.time || "",
          availabilityId: appointment.availabilityId || ""
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, appointment: false }));
      }
    };

    fetchAppointment();
  }, [id]);

  // Charger les disponibilités après avoir obtenu le medecinId
  useEffect(() => {
    if (!currentAppointment?.medecinId) return;

    const fetchAvailabilities = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disponibilites/${currentAppointment.medecinId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Impossible de charger les disponibilités");
        }

        const data = await response.json();
        const availabilities = data.a_venir || data.availabilities || [];

        // Filtrer les disponibilités valides
        const validAvailabilities = availabilities.filter((avail: any) => {
          return isAfter(parseISO(avail.date), new Date());
        });

        setAvailabilities(validAvailabilities);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, availabilities: false }));
      }
    };

    fetchAvailabilities();
  }, [currentAppointment?.medecinId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    // Validation
    if (!formData.availabilityId || !formData.time) {
      setError("Veuillez sélectionner un créneau et une heure");
      return;
    }
  
    if (currentAppointment?.status === "accepter") {
      setError("Ce rendez-vous a déjà été accepté et ne peut plus être modifié");
      return;
    }
  
    try {
      const token = getAccessToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availabilityId: formData.availabilityId,
            time: formData.time,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
  
      setSuccess("Rendez-vous modifié avec succès !");
      
      // Rediriger vers la page d'historique des rendez-vous et mettre à jour les rendez-vous
      setTimeout(() => {
        navigate("/dashboard/appointmentHistory");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };
  

  if (loading.appointment || loading.availabilities) {
    return <Spinner animation="border" className="m-5" />;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Reprogrammer le rendez-vous</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {currentAppointment?.status === "accepter" ? (
        <Alert variant="warning">
          Ce rendez-vous a été accepté et ne peut plus être modifié.
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Créneau horaire</Form.Label>
            <Form.Select
              value={formData.availabilityId}
              onChange={(e) =>
                setFormData({ ...formData, availabilityId: e.target.value })
              }
              required
            >
              <option value="">Sélectionnez un créneau</option>
              {availabilities.map((avail) => (
                <option key={avail.id} value={avail.id}>
                  {format(parseISO(avail.date), "dd/MM/yyyy")} - {avail.startTime} à {avail.endTime}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Heure précise</Form.Label>
            <Form.Control
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Enregistrer les modifications
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Annuler
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default RescheduleAppointment;