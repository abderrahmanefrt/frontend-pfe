import React, { useEffect, useState } from "react";

interface Report {
  id: number;
  title: string;
  description: string;
  date: string;
  value: number; // This could represent a metric (ex: count, percentage, average)
}

const ReportViewer: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching report data from an API
  useEffect(() => {
    const dummyReports: Report[] = [
      {
        id: 1,
        title: "User Signups",
        description: "Number of new users registered in December",
        date: "2024-12-01",
        value: 150,
      },
      {
        id: 2,
        title: "Appointments Scheduled",
        description: "Total appointments scheduled in December",
        date: "2024-12-01",
        value: 200,
      },
      {
        id: 3,
        title: "Average Wait Time",
        description: "Average waiting time (in minutes) for appointments",
        date: "2024-12-01",
        value: 15,
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setReports(dummyReports);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Report Viewer</h2>
      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.title}</td>
                  <td>{report.description}</td>
                  <td>{report.date}</td>
                  <td>{report.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Optionally, we can include a chart or additional summary info here */}
        </>
      )}
    </div>
  );
};

export default ReportViewer;
