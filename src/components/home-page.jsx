import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div
      className="d-flex flex-column bg-light flex-md-row justify-content-center align-items-center gap-3 gap-md-5 p-5"
      style={{ minHeight: "91vh" }}
    >
      <div className="my-2 w-100 d-flex justify-content-center animate__animated animate__zoomIn">
        <Link
          to="/amount-calculate"
          className="w-100"
          style={{ maxWidth: "250px" }}
        >
          <Button
            fullWidth
            className="animate__animated animate__fadeInLeft fs-6 py-3"
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 500,
              borderRadius: "8px",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 15,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
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
            color="primary"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 500,
              borderRadius: "8px",
              boxShadow: 5,
              "&:hover": {
                boxShadow: 15,
                transform: "translateY(-2px)",
              },
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
