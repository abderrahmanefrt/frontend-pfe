import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container-fluid p-0">
      {/* Hero Section with navbar spacing */}
      <div 
        className="hero-section d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage: "url('/assets/hero-medical.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "calc(100vh - 56px)", // Adjust for navbar height
          minHeight: "500px",
          color: "white",
          position: "relative",
          marginTop: "56px" // Push content below fixed navbar
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div 
          className="bg-dark opacity-50 position-absolute top-0 start-0 w-100 h-100"
        ></div>
        
        <div className="z-1 px-3" style={{ maxWidth: "800px" }}>
          <h1 className="display-4 fw-bold mb-4">Manage Your Medical Appointments Online</h1>
          <p className="lead mb-4 fs-4">
            Find top doctors, book appointments quickly, and manage your health with ease.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <Link to="/signup" className="btn btn-primary btn-lg px-4 py-3 fw-bold">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold">
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5 my-4">
        <h2 className="text-center mb-5 display-5 fw-bold">Why Choose Our Platform?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body text-center p-4">
                <i className="bi bi-clock-history display-4 text-primary mb-3"></i>
                <h4 className="card-title fw-bold">Fast Booking</h4>
                <p className="card-text text-muted">
                  Book appointments in minutes with our streamlined process.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body text-center p-4">
                <i className="bi bi-person-check display-4 text-success mb-3"></i>
                <h4 className="card-title fw-bold">Trusted Doctors</h4>
                <p className="card-text text-muted">
                  Verified professionals with detailed profiles and patient reviews.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body text-center p-4">
                <i className="bi bi-shield-lock display-4 text-danger mb-3"></i>
                <h4 className="card-title fw-bold">Secure & Private</h4>
                <p className="card-text text-muted">
                  HIPAA-compliant platform protecting your health information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-light py-5 my-4">
        <div className="container">
          <h2 className="text-center mb-5 display-5 fw-bold">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="fs-4 fw-bold">1</span>
                  </div>
                  <h4 className="card-title fw-bold mt-3">Search</h4>
                  <p className="card-text text-muted">
                    Find specialists by name, location, or specialty.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="fs-4 fw-bold">2</span>
                  </div>
                  <h4 className="card-title fw-bold mt-3">Book</h4>
                  <p className="card-text text-muted">
                    Select preferred time and confirm with one click.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="fs-4 fw-bold">3</span>
                  </div>
                  <h4 className="card-title fw-bold mt-3">Attend</h4>
                  <p className="card-text text-muted">
                    Get reminders and attend your appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container py-5 my-4">
        <h2 className="text-center mb-5 display-5 fw-bold">Patient Experiences</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 hover-shadow transition-all">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>
                <h5 className="mb-0 fw-bold">Sarah M.</h5>
              </div>
              <p className="card-text text-muted">
                "Saved me hours of phone calls. Booked my dermatology appointment in under 2 minutes!"
              </p>
              <div className="text-warning">
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
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>
                <h5 className="mb-0 fw-bold">John D.</h5>
              </div>
              <p className="card-text text-muted">
                "The doctor profiles with reviews helped me choose the perfect cardiologist for my needs."
              </p>
              <div className="text-warning">
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
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                  <i className="bi bi-person-fill fs-5"></i>
                </div>
                <h5 className="mb-0 fw-bold">Emily R.</h5>
              </div>
              <p className="card-text text-muted">
                "The reminder system is fantastic. Never missed an appointment since I started using this service."
              </p>
              <div className="text-warning">
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
    </div>
  );
};

export default Home;