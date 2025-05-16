import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideNavbar, { NavItem } from "../components/SideNavbar";

// Tip and habit data
const tips = [
  "Take a 5-minute break to breathe deeply.",
  "Go for a short walk to boost your energy.",
  "Stretch your shoulders and neck to relieve tension.",
  "Drink a glass of water before each meal to stay hydrated.",
];
const motivationalQuotes = [
  "Health isn't everything, but without health, everything is nothing.",
  "Every step counts: make a small effort today for a better well-being.",
  "Your body deserves the best—treat it with care.",
];
const initialHabits = [
  { label: "8 glasses of water", done: false },
  { label: "30 min walk", done: false },
  { label: "5 min meditation", done: false },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems: NavItem[] = [
    { label: "My Profile", path: "/patient/profile" },
    { label: "Find a Doctor", path: "/doctorSearch" },
    { label: "My Appointments", path: "/dashboard/appointmentHistory" },
    { label: "Account Settings", path: "/settings" },
  ];

  const [tipIndex, setTipIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [habits, setHabits] = useState(initialHabits);

  const nextTip = () => setTipIndex((tipIndex + 1) % tips.length);
  const prevTip = () => setTipIndex((tipIndex - 1 + tips.length) % tips.length);
  const nextQuote = () => setQuoteIndex((quoteIndex + 1) % motivationalQuotes.length);

  const toggleHabit = (idx: number) => {
    const newHabits = [...habits];
    newHabits[idx].done = !newHabits[idx].done;
    setHabits(newHabits);
  };

  const upcomingCount = 2;

  return (
    <div className="container-fluid" style={{ background: "#f5f7f9", minHeight: "100vh" }}>
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <SideNavbar items={navItems} onLogout={handleLogout} />
        </div>
        <div className="col-md-9 col-lg-10 p-4 text-dark">

          {/* Hero Banner */}
          <div
            className="card mb-4 p-4"
            style={{
              borderRadius: "1rem",
              background: "#9dbeda",
              color: "#121517",
            }}
          >
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: 64,
                    height: 64,
                    fontSize: "1.5rem",
                    background: "#4682B4",
                    color: "white",
                  }}
                >
                  {user?.lastname?.[0] || "G"}
                </div>
              </div>
              <div>
                <h2 className="mb-1">Hello, {user?.lastname || "Guest"}!</h2>
                <small className="text-muted">You have {upcomingCount} upcoming appointments.</small>
              </div>
            </div>
          </div>

          {/* Health Tip */}
          <div
            className="card mb-4 p-3"
            style={{
              borderRadius: "0.75rem",
              background: "#ffffff",
              borderLeft: "4px solid #64a2d4",
            }}
          >
            <h5>Health Tip</h5>
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-sm btn-outline-secondary" onClick={prevTip}>‹</button>
              <p className="mx-3 flex-grow-1 text-center">{tips[tipIndex]}</p>
              <button className="btn btn-sm btn-outline-secondary" onClick={nextTip}>›</button>
            </div>
          </div>

          {/* Daily Habits */}
          <div
            className="card mb-4 p-3"
            style={{
              borderRadius: "0.75rem",
              background: "#ffffff",
              borderLeft: "4px solid #4682B4",
            }}
          >
            <h5>Today's Habits</h5>
            <ul className="list-group list-group-flush">
              {habits.map((h, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {h.label}
                  <input type="checkbox" checked={h.done} onChange={() => toggleHabit(i)} />
                </li>
              ))}
            </ul>
          </div>

          {/* Motivation */}
          <div
            className="card mb-4 p-3"
            style={{
              borderRadius: "0.75rem",
              background: "#fff3cd",
              borderLeft: "4px solid #4682B4",
            }}
          >
            <h5>Daily Motivation</h5>
            <p className="fst-italic">"{motivationalQuotes[quoteIndex]}"</p>
            <button className="btn btn-sm btn-outline-primary" onClick={nextQuote}>
              New Quote
            </button>
          </div>

          {/* Nested Pages */}
          <div
            className="card p-3 mt-4"
            style={{
              borderRadius: "0.5rem",
              background: "#ffffff",
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
