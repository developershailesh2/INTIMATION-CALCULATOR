import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export function ErrorPage() {
  return (
    <div
      className="d-flex flex-column text-dark rounded-4 justify-content-center align-items-center m-2 p-2"
      style={{
        height: "100vh",
        backgroundColor: "#F3F7F0",
        color: "#333",
      }}
    >
      <div className="h1">😟</div>
      <div className="h2 mt-3 text-center">Oops! Page Not Found</div>
      <div className="h3 text-center mt-4">
        The page you're looking for doesn't exist.
      </div>
      <div className="mt-4">
        <Link to="/">
          <Button
            variant="contained"
            className="fs-5"
            color="primary"
            sx={{
              backgroundColor: "#007bff",
              color: "white",
              fontFamily: `"Times New Roman", Times, serif`,
              fontSize: "1.2rem",
              padding: "10px 30px",
              borderRadius: "30px",
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
          >
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
