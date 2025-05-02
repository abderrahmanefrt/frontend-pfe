import React, { useState, useEffect } from "react";

interface AppointmentRequest {
  id: number;
  patientName: string;
  requestedDate: string;
  requestedTime: string;
  status: "pending" | "accepted" | "rejected";
}

const AppointmentRequests: React.FC = () => {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);

  // Simulate fetching appointment requests from an API
  useEffect(() => {
    const dummyRequests: AppointmentRequest[] = [
      {
        id: 1,
        patientName: "Alice Johnson",
        requestedDate: "2025-01-15",
        requestedTime: "09:30",
        status: "pending",
      },
      {
        id: 2,
        patientName: "Bob Smith",
        requestedDate: "2025-01-16",
        requestedTime: "11:00",
        status: "pending",
      },
      {
        id: 3,
        patientName: "Charlie Brown",
        requestedDate: "2025-01-17",
        requestedTime: "14:00",
        status: "pending",
      },
      {
        id: 4,
        patientName: "ben hamada ramzi",
        requestedDate: "2025-01-20",
        requestedTime: "14:00",
        status: "pending",
      },
      {
        id: 5,
        patientName: "jessi dkotton",
        requestedDate: "2025-02-20",
        requestedTime: "14:00",
        status: "pending",
      },
    ];

    // Simulate an API delay
    setTimeout(() => {
      setRequests(dummyRequests);
    }, 500);
  }, []);

  // Accept the appointment request
  const handleAccept = (id: number) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: "accepted" } : req
      )
    );
  };

  // Reject the appointment request
  const handleReject = (id: number) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: "rejected" } : req
      )
    );
  };

  return (
    <div className="container mt-4">
      
      {requests.length === 0 ? (
        <p>Loading requests...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.patientName}</td>
                <td>{request.requestedDate}</td>
                <td>{request.requestedTime}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === "pending" ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleAccept(request.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentRequests;
