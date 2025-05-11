import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles?: ("user" | "medecin" | "admin")[];
}

const PrivateRoute = ({ element, allowedRoles }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user || !user.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return element;
};

export default PrivateRoute;