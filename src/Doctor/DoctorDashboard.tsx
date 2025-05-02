import React from "react";
import { useAuth } from "../context/AuthContext";
import DoctorSchedule from "./DoctorSchedule";
import AppointmentRequests from "./AppointmentRequests";
import DoctorCard from "../components/DoctorCard";
import DoctorProfile from "./DoctorProfile";
import { useState } from "react";

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  
  return (
    <div className="container mt-4">
      <h1>Doctor Dashboard</h1>
      <p>Welcome, Dr. {user ? user.name : "Guest"}!</p>
      <div className="row">
        {/*<div>
           <DoctorCard doctorInfo={doctorInfo} doctorId={1}/>
        </div>*/}
        {/* Schedule Section */}
        <div className="col-md-6">
          <h2>Your Schedule</h2>
          <DoctorSchedule />
        </div>
        
        {/* Appointment Requests Section */}
        <div className="col-md-6">
          <h2>Appointment Requests</h2>
          <AppointmentRequests />
        </div>
        
      </div>
      <hr />
      <DoctorProfile />
      
    </div>
  );
};

export default DoctorDashboard;
