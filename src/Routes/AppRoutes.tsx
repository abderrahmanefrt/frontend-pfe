import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Dashboard from "../Patient/Dashboard";
import DoctorProfile from "../Doctor/DoctorProfile";
import NotFound from "../Pages/NotFound";
import PrivateRoute from "./PrivateRoute"; // Protects private Pages
import DoctorDashboard from "../Doctor/DoctorDashboard";
import DoctorProfileEdit from "../Doctor/ProfileUpdate";
import DoctorsList from "../Admin/DoctorsList"
import AdminDashboard from "../Admin/AdminDashboard";
import DoctorManagement from "../Admin/DoctorManagement";
import UserManagement from "../Admin/UserManagement";
import AppointmentManagement from "../Admin/AppointmentManagement";
import ReportViewer from "../Admin/ReportViewer";
import EditPatientProfile from "../Patient/EditPatientProfile";
import PatientProfile from "../Patient/PatientProfile";
import EditPatientProfileWrapper from "../Patient/EditPatientProfileWrapper";
import AdminEditPatientProfileWrapper from "../Admin/AdminEditPatientProfileWrapper";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import ScheduleAppointment from "../Patient/ScheduleAppointment";
import AppointmentHistory from "../Patient/AppointmentHistory";
import ScheduleAppointmentWrapper from "../Patient/ScheduleAppointmentWrapper";
import AccountSettings from "../Patient/AccountSettings";
import AccountSettingsWrapper from "../Patient/AccountSettingsWrapper";
import DoctorSearchWithCalendar from "../Patient/DoctorSearch";
import SignUpSelector from "../Pages/SignUpSelector";
import SignUpPatient from "../Pages/SignUpPatient";
import SignUpDoctor from "../Pages/SignUpDoctor";
import ReviewsManagement from "../Admin/ReviewsManagement";
import AdminEditDoctorWrapper from "../Admin/AdminEditDoctorWrapper";
import LoginDoctor from "../Pages/LoginDoctor";
import ChangePassword from "../Doctor/ChangePassword";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/login" element={<LoginDoctor />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/settings" element={<AccountSettingsWrapper />} />
      {/*<Route path="/edit-profile" element={<EditPatientProfile/>} />*/}
      
      <Route path="/doctorSearch" element={<DoctorSearchWithCalendar />} />
      <Route path="/patient/profile" element={<PatientProfile />} />
      <Route path="/edit-profile" element={<EditPatientProfileWrapper />} />
    

      <Route
        path="/admin/edit-user/:id"
        element={<AdminEditPatientProfileWrapper />}
      />
      <Route
        path="/admin"
        element={<PrivateRoute element={<AdminDashboard />} />}
      />
      <Route
        path="/admin/doctors"
        element={<PrivateRoute element={<DoctorManagement />} />}
      />
      <Route
        path="/admin/users"
        element={<PrivateRoute element={<UserManagement />} />}
      />
      <Route
        path="/admin/edit-doctor/:id"
        element={<PrivateRoute element={<AdminEditDoctorWrapper />} />}
      />
      <Route path="/doctor/profile/edit" element={<DoctorProfileEdit />} />

      <Route
        path="/admin/appointments"
        element={<PrivateRoute element={<AppointmentManagement />} />}
      />
      <Route
        path="/admin/reports"
        element={<PrivateRoute element={<ReportViewer />} />}
      />
      <Route
        path="/admin/reviews"
        element={<PrivateRoute element={<ReviewsManagement />} />}
      />
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} />}
      />
      <Route
        path="/dashboard/appointmentHistory"
        element={<PrivateRoute element={<AppointmentHistory />} />}
      />

      <Route
        path="/doctor/dashboard"
        element={<PrivateRoute element={<DoctorDashboard />} />}
      />
      <Route path="/admin/doctors-list" element={<DoctorsList />} />
<Route path="/admin" element={<AdminDashboard />} />

      <Route path="/doctor/ChangePassword" element={<ChangePassword />} />

      {/* Single entry point for sign-up */}
      <Route path="/signup" element={<SignUpSelector />} />
      <Route path="/signup/patient" element={<SignUpPatient />} />
      <Route path="/signup/doctor" element={<SignUpDoctor />} />

      <Route
        path="/schedule/:appointmentId"
        element={<ScheduleAppointment />}
      />

      <Route
        path="/scheduleWrapper/:id"
        element={<ScheduleAppointmentWrapper />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
