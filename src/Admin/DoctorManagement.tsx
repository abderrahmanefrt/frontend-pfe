import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const DoctorManagement = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  useEffect(() => {
    const getPendingDoctors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/medecins-pending`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load pending doctors");
        }

        const data = await response.json();
        setDoctors(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) getPendingDoctors();
  }, [user]);

  const stripQuotes = (str: string) => str?.replace(/^"(.*)"$/, "$1");

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/medecins/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to approve doctor");
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/medecins/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to reject doctor");
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    }
  };

  const openDoctorProfile = (doctor: any) => {
    setSelectedDoctor(doctor);
  };

  const closeModal = () => setSelectedDoctor(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Pending Doctors</h2>
      {doctors.length > 0 ? (
        <ul className="list-group">
          {doctors.map((doc) => (
            <li
              key={doc.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{stripQuotes(doc.firstname)} {stripQuotes(doc.lastname)}</strong><br />
                <small className="text-muted">{stripQuotes(doc.email)}</small>
              </div>
              <div>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => openDoctorProfile(doc)}
                >
                  View Profile
                </button>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleApprove(doc.id)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(doc.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No pending doctors.</p>
      )}

      {/* Modal de profil du médecin */}
      {selectedDoctor && (
        <div className="modal show d-block bg-dark bg-opacity-75" onClick={closeModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {stripQuotes(selectedDoctor.firstname)} {stripQuotes(selectedDoctor.lastname)}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Email:</strong> {stripQuotes(selectedDoctor.email)}</p>
                <p><strong>Phone:</strong> {stripQuotes(selectedDoctor.phone)}</p>
                <p><strong>Specialty:</strong> {stripQuotes(selectedDoctor.specialite)}</p>
                <p><strong>License Number:</strong> {stripQuotes(selectedDoctor.licenseNumber)}</p>
                <p><strong>Address:</strong> {selectedDoctor.address}</p>

                {/* Document */}
                {selectedDoctor.document ? (
                  <p>
                    <strong>Document: </strong>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/${selectedDoctor.document.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  </p>
                ) : (
                  <p>No document uploaded.</p>
                )}

                {/* Photo */}
                {selectedDoctor.photo ? (
                  <div>
                    <strong>Photo:</strong>
                    <div className="mt-2">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${selectedDoctor.photo.replace(/\\/g, '/')}`}
                        alt="Doctor"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ) : (
                  <p>No photo uploaded.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button className="btn btn-danger" onClick={() => handleReject(selectedDoctor.id)}>Reject</button>
                <button className="btn btn-success" onClick={() => handleApprove(selectedDoctor.id)}>Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
