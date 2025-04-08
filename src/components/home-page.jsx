import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import "./homepage.css";

export function HomePage() {
  return (
    <div id="home-page">
      <div className="contents container-sm">
        <h1 className="animate__animated animate__backInLeft text-primary fw-bold ms-5 mt-5 mb-4">
          Intimation Calculator
        </h1>
        <p className="headings pt-3">
          Easily calculate billing amounts.
          <br />
          Manage admin tasks with ease. <br />
          Simplifying Loan Processing with Smart Calculations. <br />
          Say goodbye to manual errors let the system do the math!
        </p>

        <div className="d-flex flex-column flex-md-row rounded-4 p-3 m-3 w-75">
          <Link className="p-1 m-3" to="/amount-calculate">
            <Button
              fullWidth
              className="border border-danger p-3 "
              sx={{
                fontFamily: "sans-serif",
                fontSize: "15px",
                color: "red",
                bgcolor: "white",
                ":hover": { bgcolor: "red", color: "white" },
              }}
            >
              Billing Calculator
            </Button>
          </Link>

          <Link className="p-1 m-3" to="/admin-login">
            <Button
              fullWidth
              className="border border-danger p-3"
              sx={{
                color: "red",
                bgcolor: "white",
                fontSize: "15px",
                ":hover": {
                  borderColor: "red",
                  color: "white",
                  bgcolor: "red",
                },
              }}
            >
              Admin Login
            </Button>
          </Link>
        </div>

        {/* <h5 className="animate__animated animate__bounceInRight text-muted" >
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
        </h5> */}
      </div>

      {/* <div className="my-2 w-100 d-flex justify-content-start animate__animated animate__zoomIn">
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
      </div> */}

      {/* <div className="my-2 w-100 d-flex justify-content-start animate__animated animate__zoomIn">
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
      </div> */}
    </div>
  );
}
