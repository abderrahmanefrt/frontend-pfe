import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  brand: string;
}

const Navbar: React.FC<NavbarProps> = ({ brand }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-sm fixed-top">
      <div className="container">
        {/* Brand with enhanced styling */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-heart-pulse-fill me-2 fs-4"></i>
          <span className="d-none d-sm-inline">{brand}</span>
        </Link>

        {/* Mobile Toggle with animation */}
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

        {/* Navigation Links with hover effects */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 rounded position-relative" to="/">
                <i className="bi bi-house-door me-1 d-lg-none"></i>
                Home
                <span className="position-absolute bottom-0 start-50 translate-middle-x bg-light rounded-pill" style={{ width: '0', height: '2px', transition: 'width 0.3s' }}></span>
              </Link>
            </li>

            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 rounded position-relative" to="/login">
                <i className="bi bi-box-arrow-in-right me-1 d-lg-none"></i>
                Login
                <span className="position-absolute bottom-0 start-50 translate-middle-x bg-light rounded-pill" style={{ width: '0', height: '2px', transition: 'width 0.3s' }}></span>
              </Link>
            </li>

            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 rounded position-relative" to="/about">
                <i className="bi bi-info-circle me-1 d-lg-none"></i>
                About
                <span className="position-absolute bottom-0 start-50 translate-middle-x bg-light rounded-pill" style={{ width: '0', height: '2px', transition: 'width 0.3s' }}></span>
              </Link>
            </li>

            <li className="nav-item mx-1">
              <Link className="nav-link px-3 py-2 rounded position-relative" to="/contact">
                <i className="bi bi-envelope me-1 d-lg-none"></i>
                Contact
                <span className="position-absolute bottom-0 start-50 translate-middle-x bg-light rounded-pill" style={{ width: '0', height: '2px', transition: 'width 0.3s' }}></span>
              </Link>
            </li>

            {/* Enhanced Dropdown */}
            <li className="nav-item dropdown mx-1">
              <a className="nav-link dropdown-toggle px-3 py-2 rounded d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-three-dots-vertical me-1 d-lg-none"></i>
                More
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li>
                  <Link className="dropdown-item py-2 px-3 d-flex align-items-center" to="/privacy">
                    <i className="bi bi-shield-lock me-2"></i>Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 px-3 d-flex align-items-center" to="/terms">
                    <i className="bi bi-file-text me-2"></i>Terms of Use
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <Link className="dropdown-item py-2 px-3 d-flex align-items-center" to="/faq">
                    <i className="bi bi-question-circle me-2"></i>FAQ
                  </Link>
                </li>
              </ul>
            </li>

            {/* Enhanced Search Bar */}
            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
              <form className="d-flex" role="search">
                <div className="input-group">
                  <input
                    className="form-control border-end-0 rounded-start"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    style={{ minWidth: '150px' }}
                  />
                  <button className="btn btn-light border-start-0 rounded-end" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;