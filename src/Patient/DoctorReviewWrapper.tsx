import React from "react";
import { useParams } from "react-router-dom";
import DoctorReview from "./DoctorReview";

const DoctorReviewWrapper = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Médecin introuvable</p>;

  return <DoctorReview medecinId={parseInt(id)} />;
};

export default DoctorReviewWrapper;
