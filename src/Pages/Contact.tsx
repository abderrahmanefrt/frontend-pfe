import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the data to your backend.
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="container mt-4">
      <h1>Contact Us</h1>
      <p>
        If you have any clarifications, questions, or need more details about our
        platform, please feel free to reach out using the form below or through our
        contact information.
      </p>
      
      <div className="mb-4">
        <h3>Our Contact Information</h3>
        <p><strong>Email:</strong> info@medicalappointments.com</p>
        <p><strong>Phone:</strong> (123) 456-7890</p>
        <p><strong>Address:</strong> 123 Medical Lane, Health City, Country</p>
      </div>

      {submitted ? (
        <div className="alert alert-success" role="alert">
          Thank you for contacting us! We will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="form-control"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
