import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const getAccessToken = () => localStorage.getItem("accessToken");

const DoctorAvailabilityPage = () => {
  const { medecinId } = useParams<{ medecinId: string }>();
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/disponibilites/${medecinId}`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch availabilities");

        const data = await response.json();
        setAvailabilities(data.a_venir || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    fetchAvailabilities();
  }, [medecinId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Doctor Availability
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      {availabilities.length === 0 ? (
        <p className="text-center text-gray-600">No availabilities found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {availabilities.map((avail) => (
            <div
              key={avail.id}
              onClick={() =>
                navigate(`/book-appointment/${medecinId}/${avail.id}`, {
                  state: {
                    date: avail.date,
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                  },
                })
              }
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <p className="text-lg font-semibold text-gray-800">
                📅 {new Date(avail.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-700">
                🕒 {avail.startTime} - {avail.endTime}
              </p>
              <p className="text-gray-600">
                👥 Max Patients: {avail.maxPatient || "Not specified"}
              </p>
              <p className="text-sm text-blue-500 mt-2">Click to book</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAvailabilityPage;
