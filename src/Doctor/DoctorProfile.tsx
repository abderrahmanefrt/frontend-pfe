import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListGroupItem } from "../components/ListGroup";
import ProfileUpdate from "./ProfileUpdate";
import StarRating from "../components/StarRating";
import FeedbackForm from "../components/FeedbackForm";
import { Feedback } from "../types/Feedback";

interface DoctorDetails {
  id: number;
  name: string;
  image: string;
  specialty: string;
  biography: string;
  contactInfo: string;
  doctorInfo: ListGroupItem[];
}

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [editing, setEditing] = useState(false);

  // Feedback state now includes a status field
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  // Fetch doctor details and initial feedback list
  useEffect(() => {
    const dummyDoctor: DoctorDetails = {
      id: Number(id),
      name: "Dr. John Doe",
      image: "../assets/images/DoctorImg.jpg",
      specialty: "Cardiology",
      biography:
        "Dr. John Doe has been practicing cardiology for over 15 years...",
      contactInfo: "Phone: 123-456-7890 | Email: dr.johndoe@example.com",
      doctorInfo: [
        { label: "Specialty", value: "Cardiology" },
        { label: "Experience", value: "15 years" },
        { label: "Clinic", value: "Heart Health Clinic" },
      ],
    };
    setTimeout(() => setDoctor(dummyDoctor), 1000);

    // Dummy feedback entries with varied status
    const dummyFeedback: Feedback[] = [
      { id: 1, patientName: "Alice", date: "2025-04-01", rating: 5, comment: "Excellent care.", status: "approved" },
      { id: 2, patientName: "Bob",   date: "2025-04-10", rating: 4, comment: "Good, but wait was long.", status: "approved" },
      { id: 3, patientName: "Eve",   date: "2025-04-15", rating: 3, comment: "Average experience.",      status: "pending"  },
    ];
    setFeedbackList(dummyFeedback);
  }, [id]);

  if (!doctor) return <div>Loading doctor details...</div>;

  // Only show approved feedback
  const approvedFeedback = feedbackList.filter(fb => fb.status === "approved");

  // Compute average from approved reviews
  const averageRating =
    approvedFeedback.reduce((sum, f) => sum + f.rating, 0) /
    (approvedFeedback.length || 1);

  // Handle new patient feedback → mark as pending
  const handleNewFeedback = (rating: number, comment: string) => {
    const newFb: Feedback = {
      id: Date.now(),
      patientName: "You",
      date: new Date().toISOString().split("T")[0],
      rating,
      comment,
      status: "pending"
    };
    setFeedbackList([newFb, ...feedbackList]);
    alert("Votre commentaire a été soumis et est en attente d'approuvement.");
  };

  const handleUpdate = (updatedDoctor: DoctorDetails) => {
    setDoctor(updatedDoctor);
    setEditing(false);
  };

  return (
    <div className="container mt-4">
      {editing ? (
        <ProfileUpdate
          doctor={doctor}
          onUpdate={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <h1>{doctor.name}</h1>
          <div className="row">
            <div className="col-md-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="img-fluid rounded mb-3"
              />
              <h4>{doctor.specialty}</h4>
              <p>{doctor.contactInfo}</p>
            </div>
            <div className="col-md-8">
              <h3>Biography</h3>
              <p>{doctor.biography}</p>
              <hr />
              <h4>Additional Information</h4>
              <ul className="list-group">
                {doctor.doctorInfo.map((item, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>

          {/* Patient Feedback Section */}
          <section className="mt-5">
            <h2>Patient Feedback</h2>
            <div className="d-flex align-items-center mb-3">
              <StarRating value={averageRating} readOnly />
              <span className="ms-2">({approvedFeedback.length} avis)</span>
            </div>
            <div>
              {approvedFeedback.map(fb => (
                <div key={fb.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <strong>{fb.patientName}</strong>
                      <small>{fb.date}</small>
                    </div>
                    <StarRating value={fb.rating} readOnly className="my-1" />
                    <p>{fb.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3>Leave your feedback</h3>
              <FeedbackForm onSubmit={handleNewFeedback} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DoctorProfile;
