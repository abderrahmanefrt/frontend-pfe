import React from "react";
import LoginForm from "../components/LoginForm"

const Login: React.FC = () => {
  return (
    <div className="container mt-5">
      {/*<h2 className="mb-4">Login</h2>*/}
      <LoginForm />
    </div>
  );
};

export default Login;
