import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar brand="Navigation" />
        <div className="main-content">
          <AppRoutes />
        </div>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;