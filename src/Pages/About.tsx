import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mt-4">
      <h1>About Our Platform</h1>
      <p>
        Welcome to our Medical Appointment Management Platform! Our mission is to streamline the process of booking, managing, and reviewing medical appointments, providing a seamless experience for patients, doctors, and administrators.
      </p>
      
      <h2>Our Mission</h2>
      <p>
        Our goal is to improve healthcare accessibility by simplifying appointment scheduling and enhancing communication between patients and healthcare professionals.
      </p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Easy appointment scheduling and management for patients.</li>
        <li>Detailed doctor profiles including specialties, experience, and patient reviews.</li>
        <li>Role-based access for Admins, Doctors, and Patients.</li>
        <li>Automated reminders and notifications for upcoming appointments.</li>
        <li>Secure authentication and data protection.</li>
      </ul>
      
      <h2>Our Team</h2>
      <p>
        Our team consists of dedicated professionals in healthcare and technology, committed to delivering an innovative solution that benefits everyone in the medical community.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        For more information or support, please contact us at <a href="mailto:info@healthappointments.com">info@healthappointments.com</a>.
      </p>
    </div>
  );
};

export default About;
