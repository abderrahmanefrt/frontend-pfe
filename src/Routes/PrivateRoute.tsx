import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { user, loading } = useAuth(); // 👈 maintenant on utilise loading aussi
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // ou un vrai spinner si tu veux
  }

  if (!user || !user.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
