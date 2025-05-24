import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faUserMd, 
  faCalendarCheck, 
  faCog, 
  faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";

export interface NavItem {
  label: string;
  path: string;
}

interface SideNavbarProps {
  items: NavItem[];
  onLogout: () => void;
  onNavigate?: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ items, onLogout, onNavigate }) => {
  const location = useLocation();

  const getIcon = (label: string) => {
    switch (label) {
      case "My Profile":
        return faUser;
      case "Find a Doctor":
        return faUserMd;
      case "My Appointments":
        return faCalendarCheck;
      case "Account Settings":
        return faCog;
      default:
        return faUser;
    }
  };

  return (
    <div
      className="side-navbar p-3 d-flex flex-column"
      style={{
        backgroundColor: "var(--background)",
        height: "100vh",
        position: "sticky",
        top: 0,
        borderRight: "1px solid var(--secondary)",
        overflowY: "auto",
        width: "100%",
        maxWidth: "280px",
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)"
      }}
    >
      <h2 className="mb-4" style={{ color: "var(--primary)" }}>Dashboard</h2>
      <nav className="nav flex-column flex-grow-1">
        {items.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              onClick={onNavigate}
              className={`nav-link mb-2 d-flex align-items-center ${
                isActive ? "active" : ""
              }`}
              style={{
                color: isActive ? "var(--primary)" : "var(--text)",
                backgroundColor: isActive ? "rgba(var(--primary-rgb), 0.1)" : "transparent",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                fontWeight: isActive ? "600" : "500",
                textDecoration: "none",
              
              }}
            >
              <FontAwesomeIcon 
                icon={getIcon(item.label)} 
                className="me-2"
                style={{ width: "20px", color: isActive ? "var(--primary)" : "var(--text)" }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-3">
        <button 
          onClick={onLogout} 
          className="btn w-100 d-flex align-items-center justify-content-center logout-btn"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
            backgroundColor: "transparent",
            color: "var(--accent)",
            border: "1px solid var(--accent)"
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </button>
      </div>
      <style>{`
        @media (max-width: 991.98px) {
          .side-navbar {
            position: fixed !important;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1040;
            box-shadow: 2px 0 16px rgba(0,0,0,0.12);
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          }
          .side-navbar.open {
            transform: translateX(0);
          }
        }
        .logout-btn:hover {
          background-color: rgba(var(--accent-rgb), 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default SideNavbar;