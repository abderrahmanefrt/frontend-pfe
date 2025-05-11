import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideNavbar, { NavItem } from "../components/SideNavbar";

// Tip and habit data
const tips = [
  "Prenez une pause de 5 minutes pour respirer profondément.",
  "Faites une courte promenade pour stimuler votre énergie.",
  "Étirez vos épaules et votre cou pour soulager la tension.",
  "Buvez un verre d'eau avant chaque repas pour rester hydraté."
];
const motivationalQuotes = [
  "La santé n'est pas tout, mais sans la santé, tout n'est rien.",
  "Chaque pas compte : faites aujourd'hui un petit effort pour un grand bien-être.",
  "Votre corps mérite le meilleur—traitez-le avec soin.",
];
const initialHabits = [
  { label: "8 verres d'eau", done: false },
  { label: "30 min de marche", done: false },
  { label: "Méditation 5 min", done: false },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems: NavItem[] = [
    { label: "Patient Profile", path: "/patient/profile" },
    { label: "Doctor Search", path: "/doctorSearch" },
    { label: "Appointment History", path: "/dashboard/appointmentHistory" },
    { label: "Settings", path: "/settings" }
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <SideNavbar items={navItems} onLogout={handleLogout} />
        </div>
        <div className="col-md-9 col-lg-10 p-4" style={{ background: "#f8f9fa" }}>

          {/* Hero Banner */}
          <div className="card mb-4 p-4" style={{ borderRadius: "1rem", background: "#e9f7ef" }}>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div 
                  className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" 
                  style={{ width: 64, height: 64, fontSize: "1.5rem" }}
                >
                  {user?.lastname?.[0] || "G"}
                </div>
              </div>
              <div>
                <h2 className="mb-1">Bonjour, {user?.lastname || "Guest"} !</h2>
                <small className="text-muted">Vous avez {upcomingCount} rendez-vous à venir.</small>
              </div>
            </div>
          </div>

          

          {/* Personalized Tips Carousel */}
          <div className="card mb-4 p-3" style={{ borderRadius: "0.75rem" }}>
            <h5>Conseil Santé</h5>
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-sm btn-outline-secondary" onClick={prevTip}>‹</button>
              <p className="mx-3 flex-grow-1 text-center">{tips[tipIndex]}</p>
              <button className="btn btn-sm btn-outline-secondary" onClick={nextTip}>›</button>
            </div>
          </div>

          {/* Daily Habit Tracker */}
          <div className="card mb-4 p-3" style={{ borderRadius: "0.75rem" }}>
            <h5>Habitudes du Jour</h5>
            <ul className="list-group list-group-flush">
              {habits.map((h, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                  {h.label}
                  <input type="checkbox" checked={h.done} onChange={() => toggleHabit(i)} />
                </li>
              ))}
            </ul>
          </div>

          {/* Motivational Quote */}
          <div className="card mb-4 p-3" style={{ borderRadius: "0.75rem", background: "#fff3cd" }}>
            <h5>Motivation du Jour</h5>
            <p className="fst-italic">"{motivationalQuotes[quoteIndex]}"</p>
            <button className="btn btn-sm btn-outline-primary" onClick={nextQuote}>Nouveau</button>
          </div>

          {/* Nested Routes */}
          <div className="card p-3 mt-4" style={{ borderRadius: "0.5rem" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;