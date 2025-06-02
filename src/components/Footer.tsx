// Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="pt-5 pb-4 mt-5" style={{ backgroundColor: '#121517', color: '#f5f7f9' }}>
      <div className="container">
        <div className="row">
          {/* About Indoctor */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 fw-bold fs-4">
                <span style={{ color: '#4682B4' }}>Indoctor</span>
              </h5>
            </div>
            <p style={{ opacity: 0.75 }}>
              Indoctor revolutionizes medical appointments in Algeria. 
              Our platform connects patients with the best healthcare 
              professionals in just a few clicks.
            </p>
            <div className="mt-3">
              <a href="#" className="me-3 fs-5 hover-primary" style={{ color: '#f5f7f9' }}><i className="bi bi-facebook"></i></a>
              <a href="#" className="me-3 fs-5 hover-primary" style={{ color: '#f5f7f9' }}><i className="bi bi-instagram"></i></a>
              <a href="#" className="me-3 fs-5 hover-primary" style={{ color: '#f5f7f9' }}><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="fs-5 hover-primary" style={{ color: '#f5f7f9' }}><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 fs-5">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctors" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> Doctors
                </Link>
              </li>
            
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> About
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 fs-5">My Account</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/login" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/signup" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> Sign Up
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9', opacity: 0.75 }}>
                  <i className="bi bi-chevron-right me-1" style={{ color: '#4682B4' }}></i> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 fs-5">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex">
                <i className="bi bi-geo-alt-fill me-3 mt-1 fs-5" style={{ color: '#4682B4' }}></i>
                <span style={{ opacity: 0.75 }}>Bab ezouar, Alger, Algeria</span>
              </li>
              <li className="mb-3 d-flex">
                <i className="bi bi-envelope-fill me-3 mt-1 fs-5" style={{ color: '#4682B4' }}></i>
                <span style={{ opacity: 0.75 }}>Indoctor@gmail.com</span>
              </li>
              <li className="mb-3 d-flex">
                <i className="bi bi-telephone-fill me-3 mt-1 fs-5" style={{ color: '#4682B4' }}></i>
                <span style={{ opacity: 0.75 }}>+213 777 736 165</span>
              </li>
              <li className="mb-3 d-flex">
                <i className="bi bi-clock-fill me-3 mt-1 fs-5" style={{ color: '#4682B4' }}></i>
                <span style={{ opacity: 0.75 }}></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 mt-4" style={{ borderTop: '1px solid #6c757d' }}>
          <p className="mb-0">
            <span style={{ opacity: 0.75 }}>&copy; {new Date().getFullYear()} </span>
            <span className="fw-bold" style={{ color: '#4682B4' }}>Indoctor</span>
            <span style={{ opacity: 0.75 }}>. All rights reserved. | </span>
            <Link to="/privacy" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9' }}>
              Privacy
            </Link>
            <span style={{ opacity: 0.75 }}> | </span>
            <Link to="/conditions" className="text-decoration-none hover-primary" style={{ color: '#f5f7f9' }}>
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;