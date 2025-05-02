import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
 {/* const isAuthenticated = localStorage.getItem("authToken"); // we Replace with our auth logic

  return isAuthenticated ? element : <Navigate to="/login" />;*/}
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
