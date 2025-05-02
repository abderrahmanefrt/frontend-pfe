import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="display-3 text-danger fw-bold">404</h1>
      <h2 className="mb-3">Oops! Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
