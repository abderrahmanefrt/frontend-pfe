// Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import heroImage from '../assets/hero-medical.jpg';

const Home: React.FC = () => {
  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f5f7f9' }}>
      {/* Hero Section with navbar spacing */}
      <div 
  className="hero-section d-flex align-items-center justify-content-center text-center"
  style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh", // Changed to full viewport height
    minHeight: "500px",
    color: "white",
    position: "relative",
    marginTop: "-4px ", // Removed marginTop
    top: "0",
    paddingTop: "56px",
    borderTop: "1px solid transparent"  // Added paddingTop instead to account for navbar
  }}
>
  <div className="z-1 px-3" style={{ maxWidth: "800px", position: 'relative' }}>
    <div className="mb-4">
      <span className="badge text-white fs-5 mb-3 px-4 py-2 rounded-pill" style={{ backgroundColor: '#4682B4' }}>
        Welcome to Indoctor
      </span>
    </div>
    <h1 className="display-4 fw-bold mb-4">
      <span style={{ color: '#64a2d4' }}>Indoctor</span>: Smart Medical Appointments
    </h1>
    <p className="lead mb-4 fs-4">
      Find top doctors, book appointments instantly, and manage your health records - 
      all in one place with <strong>Indoctor</strong>.
    </p>
    <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
      <Link to="/signup" className="btn btn-lg px-4 py-3 fw-bold" style={{ backgroundColor: '#4682B4', color: 'white' }}>
        Get Started with Indoctor
      </Link>
      <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold">
        Access Your Indoctor Account
      </Link>
    </div>
  </div>
</div>

      {/* Branding Section */}
      <div className="py-4" style={{ backgroundColor: '#4682B4', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-6 fw-bold mb-3">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Why <span style={{ color: '#f5f7f9' }}>Indoctor</span> Stands Out
          </h2>
          <p className="lead mb-0">
            The most trusted medical appointment platform with over 5,000 healthcare providers
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5 my-4">
        <h2 className="text-center mb-5 display-5 fw-bold" style={{ color: '#121517' }}>
          <span style={{ color: '#4682B4' }}>Indoctor</span> Key Features
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body text-center p-4">
                <i className="bi bi-clock-history display-4 mb-3" style={{ color: '#4682B4' }}></i>
                <h4 className="card-title fw-bold" style={{ color: '#121517' }}>Fast Booking</h4>
                <p className="card-text" style={{ color: '#6c757d' }}>
                  Indoctor's smart system finds you the earliest available slots.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body text-center p-4">
                <i className="bi bi-person-check display-4 mb-3" style={{ color: '#4682B4' }}></i>
                <h4 className="card-title fw-bold" style={{ color: '#121517' }}>Verified Doctors</h4>
                <p className="card-text" style={{ color: '#6c757d' }}>
                  Every Indoctor provider is thoroughly vetted and certified.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body text-center p-4">
                <i className="bi bi-shield-lock display-4 mb-3" style={{ color: '#4682B4' }}></i>
                <h4 className="card-title fw-bold" style={{ color: '#121517' }}>Secure Platform</h4>
                <p className="card-text" style={{ color: '#6c757d' }}>
                  Indoctor uses military-grade encryption for your health data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-5 my-4" style={{ backgroundColor: '#f5f7f9' }}>
        <div className="container">
          <h2 className="text-center mb-5 display-5 fw-bold" style={{ color: '#121517' }}>
            How <span style={{ color: '#4682B4' }}>Indoctor</span> Works
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', backgroundColor: '#4682B4', color: 'white'}}>
                    <span className="fs-4 fw-bold">1</span>
                  </div>
                  <h4 className="card-title fw-bold mt-3" style={{ color: '#121517' }}>Search</h4>
                  <p className="card-text" style={{ color: '#6c757d' }}>
                    Use Indoctor's smart filters to find your perfect doctor.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', backgroundColor: '#4682B4', color: 'white'}}>
                    <span className="fs-4 fw-bold">2</span>
                  </div>
                  <h4 className="card-title fw-bold mt-3" style={{ color: '#121517' }}>Book</h4>
                  <p className="card-text" style={{ color: '#6c757d' }}>
                    Indoctor's real-time calendar shows all available slots.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', backgroundColor: '#4682B4', color: 'white'}}>
                    <span className="fs-4 fw-bold">3</span>
                  </div>
                  <h4 className="card-title fw-bold mt-3" style={{ color: '#121517' }}>Attend</h4>
                  <p className="card-text" style={{ color: '#6c757d' }}>
                    Indoctor reminds you and handles all follow-ups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container py-5 my-4">
        <h2 className="text-center mb-5 display-5 fw-bold" style={{ color: '#121517' }}>
          Patients Love <span style={{ color: '#4682B4' }}>Indoctor</span>
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 hover-shadow transition-all">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', backgroundColor: '#4682B4', color: 'white'}}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>
                <h5 className="mb-0 fw-bold" style={{ color: '#121517' }}>Sarah M.</h5>
              </div>
              <p className="card-text" style={{ color: '#6c757d' }}>
                "Indoctor saved me hours of phone calls. Booked my dermatology appointment in under 2 minutes!"
              </p>
              <div style={{ color: '#ffc107' }}>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 hover-shadow transition-all">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', backgroundColor: '#4682B4', color: 'white'}}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>
                <h5 className="mb-0 fw-bold" style={{ color: '#121517' }}>John D.</h5>
              </div>
              <p className="card-text" style={{ color: '#6c757d' }}>
                "Indoctor's doctor profiles helped me choose the perfect cardiologist."
              </p>
              <div style={{ color: '#ffc107' }}>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-half"></i>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 hover-shadow transition-all">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', backgroundColor: '#4682B4', color: 'white'}}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>
                <h5 className="mb-0 fw-bold" style={{ color: '#121517' }}>Emily R.</h5>
              </div>
              <p className="card-text" style={{ color: '#6c757d' }}>
                "Never missed an appointment since I started using Indoctor's reminder system."
              </p>
              <div style={{ color: '#ffc107' }}>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-5" style={{ backgroundColor: '#4682B4', color: 'white' }}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Experience Indoctor?</h2>
          <p className="lead mb-4">Join thousands of satisfied patients today</p>
          <Link to="/signup" className="btn btn-lg px-5 py-3 fw-bold" style={{ backgroundColor: '#f5f7f9', color: '#4682B4' }}>
            Create Your Indoctor Account Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;