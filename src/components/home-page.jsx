import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";

export function HomePage() {
  return (
    <div
      className="bg-dark d-flex flex-column align-items-center text-center gap-3 gap-md-5 p-5"
      style={{ minHeight: "100vh" }}
    >
      <div className="mt-4 mb-3">
    <h2 className="text-light ">Welcome To The Intimation Calculator!</h2>
    <h5 className="text-warning mt-2">
      <Typewriter
        options={{
          strings: [
            "Easily calculate billing amounts.",
            "Manage admin tasks with ease.",
            "Simplifying Loan Processing with Smart Calculations.",
          ],
          autoStart: true,
          loop: true,
          delay: 50,
        }}
      />
    </h5>
  </div>
      
      <div className="my-2 w-100 d-flex justify-content-center animate__animated animate__zoomIn">
        <Link
          to="/amount-calculate"
          className="w-100"
         style={{maxWidth : "250px" }}
        >
          <Button
            fullWidth
            className="animate__animated animate__fadeInLeft fs-6 py-3 "
            variant="contained"
            sx={{
              bgcolor : "#8A2BE2",
              border : "2px solid white",
              borderRadius: "8px",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 15,
                bgcolor : "#8000FF",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
              fontWeight:"bold"
            }}
          >
            Billing Calculator
          </Button>
        </Link>
      </div>

      <div className="my-2 w-100 d-flex justify-content-center animate__animated animate__zoomIn">
        <Link to="/admin-login" className="w-100" style={{ maxWidth: "250px"  }}>
          <Button
            fullWidth
            className="animate__animated animate__fadeInRight fs-6 py-3"
            variant="contained"
            sx={{
              
              borderRadius: "8px",
              boxShadow: 5,
              "&:hover": {
                boxShadow: 15,
                transform: "translateY(-2px)",
                bgcolor :  "#BF00FF",color:"white",
                
              },
              bgcolor:"#9400D3",
              border:"2px solid white", 
              fontWeight:"bold",
              transition: "all 0.3s ease",
            }}
          >
            Admin Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
