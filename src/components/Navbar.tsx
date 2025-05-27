// Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  brand: string;
}

const Navbar: React.FC<NavbarProps> = ({ brand }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{
      backgroundColor: 'rgba(70, 130, 180, 0.9)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      padding: '0.5rem 0'
    }}>
      <div className="container">
        {/* Brand with enhanced styling */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{
          fontSize: '1.5rem',
          letterSpacing: '0.5px'
        }}>
          <i className="bi bi-heart-pulse-fill me-2"></i>
          <span className="d-none d-sm-inline">{brand}</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 py-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 position-relative" to="/" style={{
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}>
                <i className="bi bi-house-door me-1 d-lg-none"></i>
                Home
                <span className="position-absolute bottom-0 start-50 translate-middle-x rounded-pill" style={{ 
                  width: '0', 
                  height: '2px', 
                  transition: 'width 0.3s', 
                  backgroundColor: '#f5f7f9' 
                }}></span>
              </Link>
            </li>

            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 position-relative" to="/login">
                <i className="bi bi-box-arrow-in-right me-1 d-lg-none"></i>
                Login
                <span className="position-absolute bottom-0 start-50 translate-middle-x rounded-pill" style={{ 
                  width: '0', 
                  height: '2px', 
                  transition: 'width 0.3s', 
                  backgroundColor: '#f5f7f9' 
                }}></span>
              </Link>
            </li>

            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 position-relative" to="/about">
                <i className="bi bi-info-circle me-1 d-lg-none"></i>
                About
                <span className="position-absolute bottom-0 start-50 translate-middle-x rounded-pill" style={{ 
                  width: '0', 
                  height: '2px', 
                  transition: 'width 0.3s', 
                  backgroundColor: '#f5f7f9' 
                }}></span>
              </Link>
            </li>

            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 position-relative" to="/contact">
                <i className="bi bi-envelope me-1 d-lg-none"></i>
                Contact
                <span className="position-absolute bottom-0 start-50 translate-middle-x rounded-pill" style={{ 
                  width: '0', 
                  height: '2px', 
                  transition: 'width 0.3s', 
                  backgroundColor: '#f5f7f9' 
                }}></span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;