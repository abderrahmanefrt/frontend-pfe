import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite lors de l'envoi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f5f7f9' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-5">
                <h1 className="display-5 fw-bold mb-3" style={{ color: '#4682B4' }}>Contact Us</h1>
                <p className="lead" style={{ color: '#6c757d' }}>
                  Have questions or need assistance? Our team is ready to help you.
                </p>
              </div>

              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle me-3" style={{ backgroundColor: 'rgba(70, 130, 180, 0.1)' }}>
                      <i className="bi bi-envelope-fill fs-4" style={{ color: '#4682B4' }}></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#121517' }}>Email</h5>
                      <p className="mb-0" style={{ color: '#6c757d' }}>indoctor8@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle me-3" style={{ backgroundColor: 'rgba(70, 130, 180, 0.1)' }}>
                      <i className="bi bi-telephone-fill fs-4" style={{ color: '#4682B4' }}></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#121517' }}>Phone</h5>
                      <p className="mb-0" style={{ color: '#6c757d' }}>+213 560 123 456</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="p-3 rounded-circle me-3" style={{ backgroundColor: 'rgba(70, 130, 180, 0.1)' }}>
                      <i className="bi bi-geo-alt-fill fs-4" style={{ color: '#4682B4' }}></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#121517' }}>Address</h5>
                      <p className="mb-0" style={{ color: '#6c757d' }}>123 Rue Didouche Mourad, Alger</p>
                    </div>
                  </div>
                </div>
              </div>

              {submitted ? (
                <div className="alert text-center py-4" role="alert" style={{ backgroundColor: 'rgba(100, 162, 212, 0.2)', borderLeft: '4px solid #64a2d4' }}>
                  <i className="bi bi-check-circle-fill fs-1 mb-3" style={{ color: '#64a2d4' }}></i>
                  <h3 className="fw-bold mb-2" style={{ color: '#121517' }}>Thank You!</h3>
                  <p className="mb-0" style={{ color: '#6c757d' }}>Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-bold" style={{ color: '#121517' }}>
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ borderColor: '#9dbeda' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-bold" style={{ color: '#121517' }}>
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ borderColor: '#9dbeda' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-bold" style={{ color: '#121517' }}>
                      Your Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="form-control form-control-lg border-2"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      style={{ borderColor: '#9dbeda' }}
                    ></textarea>
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-lg py-3 fw-bold"
                      disabled={isLoading}
                      style={{ 
                        backgroundColor: '#4682B4',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;