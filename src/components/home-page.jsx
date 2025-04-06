import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";

export function HomePage() {
  return (
    <div
      className="d-flex flex-column align-items-center bg-light shadow-lg rounded-3 text-center gap-md-5 p-5"
      style={{ minHeight: "85vh" }}
    >
     
      <div className="mt-3 mb-3 p-3 rounded-4">
        <h2
        style={{}}
         className="animate__animated animate__backInLeft text-primary fw-semibold">Welcome To The Intimation Calculator</h2>
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
            
            sx={{
              fontFamily:'Roboto, sans-serif',
              border: "2px solid red",
              borderRadius: "10px",
              color:"red",
              "&:hover": {
                color: "#fff",
                bgcolor: "rgb(255, 0, 13)",
              },

              fontWeight: "semibold",
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
            
            sx={{
              
              border: "2px solid red",
              borderRadius: "10px",
              color:"red",
              fontFamily:'Roboto, sans-serif',
              "&:hover": {
                border: "2px solid red",
                color:"#fff",
                bgcolor: "rgb(255, 0, 13)",
              },

              fontWeight: "semibold",
            }}
          >
            Admin Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
