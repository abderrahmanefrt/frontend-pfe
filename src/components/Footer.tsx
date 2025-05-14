import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row">

          {/* About Indoctor */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 fw-bold fs-4">
                <span className="text-primary">Indoctor</span>
              </h5>
            </div>
            <p className="text-light opacity-75">
              Indoctor révolutionne la prise de rendez-vous médicaux en Algérie. 
              Notre plateforme connecte les patients aux meilleurs professionnels 
              de santé en quelques clics.
            </p>
            <div className="mt-3">
              <a href="#" className="text-light me-3 fs-5 hover-primary"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light me-3 fs-5 hover-primary"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light me-3 fs-5 hover-primary"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-light fs-5 hover-primary"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 fs-5 text-light">Liens rapides</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Accueil
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctors" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Médecins
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 fs-5 text-light">Mon compte</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/login" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Connexion
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/signup" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Inscription
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Tableau de bord
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 fs-5 text-light">Nous contacter</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex">
                <i className="bi bi-geo-alt-fill text-primary me-3 mt-1 fs-5"></i>
                <span className="text-light opacity-75">123 Rue Didouche Mourad, Alger Centre, Algérie</span>
              </li>
              <li className="mb-3 d-flex">
                <i className="bi bi-envelope-fill text-primary me-3 mt-1 fs-5"></i>
                <span className="text-light opacity-75">contact@indoctor.dz</span>
              </li>
              <li className="mb-3 d-flex">
                <i className="bi bi-telephone-fill text-primary me-3 mt-1 fs-5"></i>
                <span className="text-light opacity-75">+213 560 123 456</span>
              </li>
              <li className="mb-3 d-flex">
                <i className="bi bi-clock-fill text-primary me-3 mt-1 fs-5"></i>
                <span className="text-light opacity-75">Lun-Ven: 8h-17h | Sam: 8h-12h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 mt-4 border-top border-secondary">
          <p className="mb-0">
            <span className="text-light opacity-75">&copy; {new Date().getFullYear()} </span>
            <span className="text-primary fw-bold">Indoctor</span>
            <span className="text-light opacity-75">. Tous droits réservés. | </span>
            <Link to="/privacy" className="text-light text-decoration-none hover-primary">
              Confidentialité
            </Link>
            <span className="text-light opacity-75"> | </span>
            <Link to="/conditions" className="text-light text-decoration-none hover-primary">
              Conditions
            </Link>
          </p>
        </div>
      </div>

      {/* Style pour les effets hover */}
      <style jsx>{`
        .hover-primary {
          transition: color 0.3s ease;
        }
        .hover-primary:hover {
          color: var(--bs-primary) !important;
          text-decoration: none;
        }
      `}</style>
    </footer>
  );
}

export default Footer;