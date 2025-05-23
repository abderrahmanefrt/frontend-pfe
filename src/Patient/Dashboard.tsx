import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SideNavbar, { NavItem } from "../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ferme le menu mobile après navigation
  const handleNavigate = () => setIsMenuOpen(false);

  // Ferme le menu si la route change (sécurité)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [window.location.pathname]);

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

  // Avatar initials
  const initials = (user?.lastname?.[0] || "P") + (user?.firstname?.[0] || "");

  return (
    <div className="container-fluid" style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Mobile Menu Button */}
      <button 
        className="btn d-md-none position-fixed top-0 end-0 m-3 z-3"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          zIndex: 1030,
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        aria-label="Open menu"
      >
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </button>

      <div className="row">
        {/* Sidebar */}
        <div 
          className={`col-md-3 col-lg-2 p-0 d-md-block ${isMenuOpen ? 'd-block' : 'd-none'} `}
          style={{
            position: isMenuOpen ? 'fixed' : 'static',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 1040,
            backgroundColor: 'white',
            width: isMenuOpen ? '280px' : 'auto',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            boxShadow: isMenuOpen ? '2px 0 8px rgba(0,0,0,0.1)' : 'none',
            padding: 0
          }}
        >
          <div className={`h-100 side-navbar${isMenuOpen ? ' open' : ''}`}>
            <SideNavbar items={navItems} onLogout={handleLogout} onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>

        {/* Main Content */}
        <div 
          className={`col-12 col-md-9 col-lg-10 p-4 text-dark ${isMenuOpen ? 'ms-0' : ''}`}
          style={{
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            marginLeft: isMenuOpen ? '280px' : '0'
          }}
        >
          {/* Header avec avatar */}
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex justify-content-center align-items-center shadow"
                style={{
                  width: 64,
                  height: 64,
                  fontSize: '1.7rem',
                  background: 'var(--primary)',
                  color: 'white',
                  fontWeight: 700,
                  border: '3px solid var(--secondary)',
                  boxShadow: '0 2px 12px rgba(70,130,180,0.10)'
                }}
              >
                {initials}
              </div>
              <div>
                <h2 className="mb-1" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.5rem' }}>
                  Hello, {user?.lastname || "Guest"}!
                </h2>
                <small className="text-muted">You have {upcomingCount} upcoming appointments.</small>
              </div>
            </div>

          </div>

          {/* Health Tip */}
          <div
            className="card mb-4 p-3 border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "#fff",
              borderLeft: "6px solid var(--accent)",
              boxShadow: '0 2px 12px rgba(100,162,212,0.08)'
            }}
          >
            <h5 style={{ color: 'var(--primary)', fontWeight: 600 }}>Health Tip</h5>
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-sm btn-outline-secondary" onClick={prevTip}>‹</button>
              <p className="mx-3 flex-grow-1 text-center mb-0" style={{ color: 'var(--text)' }}>{tips[tipIndex]}</p>
              <button className="btn btn-sm btn-outline-secondary" onClick={nextTip}>›</button>
            </div>
          </div>

          {/* Daily Habits */}
          <div
            className="card mb-4 p-3 border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "#fff",
              borderLeft: "6px solid var(--primary)",
              boxShadow: '0 2px 12px rgba(70,130,180,0.08)'
            }}
          >
            <h5 style={{ color: 'var(--primary)', fontWeight: 600 }}>Today's Habits</h5>
            <ul className="list-group list-group-flush">
              {habits.map((h, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ border: 'none', color: 'var(--text)', background: 'transparent' }}
                >
                  {h.label}
                  <input type="checkbox" checked={h.done} onChange={() => toggleHabit(i)} />
                </li>
              ))}
            </ul>
          </div>

          {/* Motivation */}
          <div
            className="card mb-4 p-3 border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "#fff3cd",
              borderLeft: "6px solid var(--secondary)",
              boxShadow: '0 2px 12px rgba(157,190,218,0.08)'
            }}
          >
            <h5 style={{ color: 'var(--secondary)', fontWeight: 600 }}>Daily Motivation</h5>
            <p className="fst-italic mb-2" style={{ color: 'var(--text)' }}>
              "{motivationalQuotes[quoteIndex]}"
            </p>
            <button className="btn btn-sm btn-outline-primary" onClick={nextQuote}>
              New Quote
            </button>
          </div>

          {/* Nested Pages */}
          <div
            className="card p-3 mt-4 border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "#ffffff",
              boxShadow: '0 2px 12px rgba(70,130,180,0.08)'
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="d-md-none position-fixed top-0 start-0 w-100 h-100"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1030,
            transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1)'
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
