import "./App.css";
import "animate.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import bootstrap from "bootstrap";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/navbar";
import { AdminLogin } from "./components/admin-login";
import { AdminDashBoard } from "./components/admin-dashboard";
import { AdminEdit } from "./components/admin-edit-info";
import { Cookies } from "react-cookie";
import { ErrorPage } from "./components/error-page";
import { HomePage } from "./components/home-page";
import { AmountCalculator } from "./components/amount-calculate";
import { useEffect, useState } from "react";
import Aos from "aos";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="amount-calculate" element={<AmountCalculator />} />
            <Route path="admin-login" element={<AdminLogin />} />
            <Route
              path="admin-dashboard"
              element={
                !Cookies.username ? (
                  <AdminDashBoard />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
            <Route path="edit-detail/:_id" element={<AdminEdit />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
