import Alert from "./components/Alert";
import Button from "./components/Button";
import { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import DoctorCard from "./components/DoctorCard";
import ListGroup from "./components/ListGroup";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar brand="Navigation"/>
      <AppRoutes />
      {/*<hr />*/}
      <Footer />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
