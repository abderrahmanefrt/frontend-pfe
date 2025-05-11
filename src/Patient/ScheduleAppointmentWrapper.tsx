import React from "react";
import { useParams } from "react-router-dom";
import CreateAppointmentModal from "../components/CreateAppointmentModal";
import { useAuth } from "../context/AuthContext";
import { useDoctor } from "../Hooks/useDoctor";

const ScheduleAppointmentWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { doctor, loading, error } = useDoctor(id || "");

  if (!id) return <div>No doctor ID provided</div>;
  if (!user) return <div>Not authenticated</div>;
  if (loading) return <div>Loading doctor information...</div>;
  if (error) return <div>Error loading doctor: {error}</div>;

  return (
    <CreateAppointmentModal
      doctorId={parseInt(id)}
      doctorName={`${doctor?.firstname} ${doctor?.lastname}`}
      show={true}
      onHide={() => window.history.back()}
      onSuccess={() => window.location.href = "/dashboard"}
    />
  );
};

export default ScheduleAppointmentWrapper;