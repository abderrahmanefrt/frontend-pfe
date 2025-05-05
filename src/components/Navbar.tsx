import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  brand: string;
}

const Navbar: React.FC<NavbarProps> = ({ brand }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-heart-pulse-fill me-2"></i>
          {brand}
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>

            {/* Optional Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                More
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/privacy">Privacy Policy</Link></li>
                <li><Link className="dropdown-item" to="/terms">Terms of Use</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/faq">FAQ</Link></li>
              </ul>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex ms-lg-3 mt-3 mt-lg-0" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-light" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
