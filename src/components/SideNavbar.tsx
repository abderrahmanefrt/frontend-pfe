import React from "react";
import { Link } from "react-router-dom";

export interface NavItem {
  label: string;
  path: string;
}

interface SideNavbarProps {
  items: NavItem[];
  onLogout: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ items, onLogout }) => {
  return (
    <div
      className="side-navbar p-3"
      style={{
        backgroundColor: "#f8f9fa", // Light gray background (Bootstrap's bg-light)
        height: "100vh",
        position: "sticky",
        top: 0,
        borderRight: "1px solid #dee2e6",
        overflowY: "auto",
      }}
    >
      <h2 className="mb-4">Dashboard</h2>
      <nav className="nav flex-column">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="nav-link mb-2 text-dark"
            style={{ fontWeight: 500 }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <button onClick={onLogout} className="btn btn-outline-danger w-100">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;

