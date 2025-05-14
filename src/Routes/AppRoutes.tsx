import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import LoginDoctor from "../Pages/LoginDoctor";
import Register from "../Pages/Register";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import NotFound from "../Pages/NotFound";
import SignUpSelector from "../Pages/SignUpSelector";
import SignUpPatient from "../Pages/SignUpPatient";
import SignUpDoctor from "../Pages/SignUpDoctor";
import DoctorProfiles from "../Pages/DoctorProfile";
import AppointmentPage from "../components/AppointmentPage ";
// Patient routes
import Dashboard from "../Patient/Dashboard";
import PatientProfile from "../Patient/PatientProfile";
import EditPatientProfileWrapper from "../Patient/EditPatientProfileWrapper";
import AppointmentHistory from "../Patient/AppointmentHistory";
import DoctorSearchWithCalendar from "../Patient/DoctorSearch";
import ScheduleAppointmentWrapper from "../Patient/ScheduleAppointmentWrapper";
import AccountSettingsWrapper from "../Patient/AccountSettingsWrapper";
import BookAppointmentPage from "../Patient/BookAppointmentPage"; 
import DoctorProfilePage from "../Patient/DoctorProfilePage";
import DoctorReviewWrapper from "../Patient/DoctorReviewWrapper";


// Doctor routes
import DoctorDashboard from "../Doctor/DoctorDashboard";
import DoctorProfileEdit from "../Doctor/ProfileUpdate";
import ChangePassword from "../Doctor/ChangePassword";

// Admin routes
import AdminDashboard from "../Admin/AdminDashboard";
import DoctorManagement from "../Admin/DoctorManagement";
import UserManagement from "../Admin/UserManagement";
import AppointmentManagement from "../Admin/AppointmentManagement";
import ReportViewer from "../Admin/ReportViewer";
import ReviewsManagement from "../Admin/ReviewsManagement";
import AdminEditPatientProfileWrapper from "../Admin/AdminEditPatientProfileWrapper";
import AdminEditDoctorWrapper from "../Admin/AdminEditDoctorWrapper";
import DoctorsList from "../Admin/DoctorsList";
import ManageDoctorReviews from "../Admin/ReviewsManagement";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/doctor/login" element={<LoginDoctor />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/doctor/:id" element={<DoctorProfiles />} />
      <Route path="/signup" element={<SignUpSelector />} />
      <Route path="/signup/patient" element={<SignUpPatient />} />
      <Route path="/signup/doctor" element={<SignUpDoctor />} />

      {/* Patient Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute element={<Dashboard />} allowedRoles={["user"]} />
        }
      />
<Route path="/admin/doctor/:doctorId/reviews" element={<ManageDoctorReviews />} />

      <Route
        path="/patient/profile"
        element={
          <PrivateRoute element={<PatientProfile />} allowedRoles={["user"]} />
        }
      />
      <Route
        path="/patient/edit-profile"
        element={
          <PrivateRoute
            element={<EditPatientProfileWrapper />}
            allowedRoles={["user"]}
          />
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute
            element={<AccountSettingsWrapper />}
            allowedRoles={["user"]}
          />
        }
      />
      <Route
        path="/dashboard/appointmentHistory"
        element={
          <PrivateRoute
            element={<AppointmentHistory />}
            allowedRoles={["user"]}
          />
        }
      />
      <Route path="/appointments/:medecinId" element={<AppointmentPage />} />
      <Route path="/book-appointment/:medecinId/:availabilityId" element={<BookAppointmentPage />} />

      <Route path="/users/doctor/:id" element={<DoctorProfilePage />} />
      <Route path="/doctor/:id/review" element={<DoctorReviewWrapper />} />

    

        <Route path="/doctorSearch"
        element={
          <PrivateRoute
            element={<DoctorSearchWithCalendar />}
            allowedRoles={["user"]}
          />
        }
      />
      <Route
        path="/scheduleWrapper/:id"
        element={
          <PrivateRoute
            element={<ScheduleAppointmentWrapper />}
            allowedRoles={["user"]}
          />
        }
      />

      {/* Doctor Protected Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <PrivateRoute element={<DoctorDashboard />} allowedRoles={["medecin"]} />
        }
      />
      <Route
        path="/doctor/profile/edit"
        element={
          <PrivateRoute
            element={<DoctorProfileEdit />}
            allowedRoles={["medecin"]}
          />
        }
      />
      <Route
        path="/doctor/ChangePassword"
        element={
          <PrivateRoute
            element={<ChangePassword />}
            allowedRoles={["medecin"]}
          />
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]} />
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <PrivateRoute
            element={<DoctorManagement />}
            allowedRoles={["admin"]}
          />
        }
      />
      <Route path="/admin/avis/:doctorId" element={<ManageDoctorReviews />} />

      <Route
        path="/admin/users"
        element={
          <PrivateRoute element={<UserManagement />} allowedRoles={["admin"]} />
        }
      />
      <Route
        path="/admin/edit-doctor/:id"
        element={
          <PrivateRoute
            element={<AdminEditDoctorWrapper />}
            allowedRoles={["admin"]}
          />
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <PrivateRoute
            element={<AppointmentManagement />}
            allowedRoles={["admin"]}
          />
        }
      />
      <Route
        path="/admin/reports"
        element={
          <PrivateRoute element={<ReportViewer />} allowedRoles={["admin"]} />
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <PrivateRoute
            element={<ReviewsManagement />}
            allowedRoles={["admin"]}
          />
        }
      />
      <Route
        path="/admin/edit-user/:id"
        element={
          <PrivateRoute
            element={<AdminEditPatientProfileWrapper />}
            allowedRoles={["admin"]}
          />
        }
      />
      <Route
        path="/admin/doctors-list"
        element={
          <PrivateRoute element={<DoctorsList />} allowedRoles={["admin"]} />
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;