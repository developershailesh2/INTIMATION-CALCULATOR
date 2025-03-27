import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";

export function HomePage() {
  return (
    <div
      className="d-flex flex-column align-items-center m-3 mt-3 rounded-4 border border-primary text-center gap-md-5 p-5"
      style={{ minHeight: "85vh" }}
    >
      <div className="mt-4 mb-3">
        <h2
        style={{}}
         className="animate__animated animate__backInLeft text-primary fw-semibold  mt-4 ">Welcome To The Intimation Calculator</h2>
        <h5 className="animate__animated animate__bounceInRight text-muted bg-light p-1 rounded mt-4" >
          <Typewriter
          
            options={{
              strings: [
                "Easily calculate billing amounts.",
                "Manage admin tasks with ease.",
                "Simplifying Loan Processing with Smart Calculations.",
              ],
              autoStart: true,
              loop: true,
              delay: 60,
            }}
          />
        </h5>
      </div>

      <div className="my-2 w-100 d-flex justify-content-center animate__animated animate__zoomIn">
        <Link
          to="/amount-calculate"
          className="w-100"
          style={{ maxWidth: "250px" }}
        >
          <Button
            fullWidth
            className="animate__animated animate__fadeInLeft fs-6 py-3 "
            variant="contained"
            sx={{
              bgcolor: "hsl(219, 89%, 55%)",
              color: "white",
              border: "1px solid white",
              borderRadius: "8px",

              "&:hover": {
                border: "2px solid white",
                color: "white",
                bgcolor: " hsl(219, 89%, 63%)",
              },

              fontWeight: "bold",
            }}
          >
            Billing Calculator
          </Button>
        </Link>
      </div>

      <div className="my-2 w-100 d-flex justify-content-center animate__animated animate__zoomIn">
        <Link to="/admin-login" className="w-100" style={{ maxWidth: "250px" }}>
          <Button
            fullWidth
            className="animate__animated animate__fadeInRight fs-6 py-3"
            variant="contained"
            sx={{
              bgcolor: "hsl(219, 89%, 55%)",
              color: "white",
              border: "1px solid white",
              borderRadius: "8px",

              "&:hover": {
                border: "2px solid white",
                color: "white",
                bgcolor: " hsl(219, 89%, 63%)",
              },

              fontWeight: "bold",
            }}
          >
            Admin Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
