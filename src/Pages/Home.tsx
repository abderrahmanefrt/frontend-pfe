import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage: "url('/assets/hero-medical.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80vh",
          color: "white",
          position: "relative"
        }}
      >
        {/* Optional overlay for better contrast */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        ></div>
        <div className="z-1 px-3">
          <h1 className="display-4 fw-bold mb-4">Manage Your Medical Appointments Online</h1>
          <p className="lead mb-4">
            Find top doctors, book appointments quickly, and manage your health with ease.
          </p>
          <div className="mt-4">
            <Link to="/signup" className="btn btn-primary btn-lg me-3">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              Log In
            </Link>
            
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mt-5">
  <h2 className="text-center mb-5">Why Choose Our Platform?</h2>
  <div className="row">
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center">
          <i className="bi bi-clock-history display-4 text-primary mb-3"></i>
          <h4 className="card-title">Fast Booking</h4>
          <p className="card-text">Book appointments quickly with our streamlined process.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center">
          <i className="bi bi-person-check display-4 text-success mb-3"></i>
          <h4 className="card-title">Trusted Doctors</h4>
          <p className="card-text">Access detailed profiles and reviews to find the best doctors.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center">
          <i className="bi bi-shield-lock display-4 text-danger mb-3"></i>
          <h4 className="card-title">Secure &amp; Reliable</h4>
          <p className="card-text">
            Your personal data is protected with state-of-the-art security.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* How It Works Section */}
      <div className="container mt-5">
  <h2 className="text-center mb-5">How It Works</h2>
  <div className="row">
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center">
          <h4 className="card-title">1. Search</h4>
          <p className="card-text">
            Find a doctor by specialty, location, and availability.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center">
          <h4 className="card-title">2. Book</h4>
          <p className="card-text">
            Choose a time slot that fits your schedule and book instantly.
          </p>
        </div>
      </div>
    </div>
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center">
          <h4 className="card-title">3. Confirm</h4>
          <p className="card-text">
            Receive confirmation and reminders for your upcoming appointment.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Testimonials Section (Optional) */}
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">What Our Users Say</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card p-3">
              <p className="card-text">"This platform made booking my appointment so easy and fast!"</p>
              <p className="fw-bold mb-0">— Sarah M.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <p className="card-text">"I love the detailed doctor profiles and the quick booking process."</p>
              <p className="fw-bold mb-0">— John D.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <p className="card-text">"A highly reliable platform. My go-to for all medical appointments."</p>
              <p className="fw-bold mb-0">— Emily R.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {/*<footer className="bg-dark text-white text-center py-3">
        <p>&copy; {new Date().getFullYear()} Medical Appointments. All rights reserved.</p>
      </footer>*/}
    </div>
  );
};

export default Home;
