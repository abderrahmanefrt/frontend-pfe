import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row">

          {/* About */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">About Us</h5>
            <p>
              Our platform helps patients find trusted doctors and book medical appointments with ease, anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/signup" className="text-light text-decoration-none">Sign Up</Link></li>
              <li><Link to="/login" className="text-light text-decoration-none">Login</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Contact</h5>
            <p><i className="bi bi-envelope me-2"></i> support@medicalapp.com</p>
            <p><i className="bi bi-telephone me-2"></i> +213 555 123 456</p>
            <div className="mt-2">
              <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center pt-3 border-top border-secondary mt-4">
          <p className="mb-0">&copy; {new Date().getFullYear()} Medical Appointments. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
