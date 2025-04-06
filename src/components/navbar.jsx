import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { RiMenu3Fill } from "react-icons/ri";

import "bootstrap/dist/js/bootstrap.bundle.min";

export function NavBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <nav
        className="navbar m-2 rounded-2"
        style={{ backgroundColor: "hotpink" }}
      >
        <div className="container-fluid">
          <div className="navbar-brand text-white fs-3 fw-semibold">
            Intimation Calculator
          </div>
          <button
            className="bg-white navbar-toggler"
            aria-controls="offcanvasNavbar"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas"
          >
            <span>
              <RiMenu3Fill />
            </span>
          </button>

          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="offcanvas"
            data-bs-backdrop="true"
          >
            <div className="offcanvas-header">
              <h4 className="offcanvas-title ">Intimation Calculator</h4>

              <button
                className="btn btn-close"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>

            <div className="offcanvas-body bg-dark text-white">
              <div className="mt-5 text-start">
                <h5>Time : {currentTime.toLocaleTimeString()}</h5>
                <h5>
                  Date :{" "}
                  {currentTime.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h5>
              </div>

              <div className="mt-5">
                <h5>Loan Processing System</h5>
                <p>
                  This system helps manage customer details, agent tracking, and
                  loan calculations efficiently.
                </p>
              </div>

              <div className="mt-4">
                <h5>Project Progress</h5>
                <div className="progress mt-3">
                  <div
                    className="fw-bold fs-6 progress-bar-striped progress-bar progress-bar-animated bg-primary"
                    role="progressbar"
                    style={{ width: "45%" }}
                  >
                    45%
                  </div>
                </div>
              </div>
            </div>

            <div
              className="offcanvas-footer border border-dark m-2 rounded p-3 text-light"
              style={{ backgroundColor: "hsl(242, 63.20%, 77.60%)" }}
            >
              <div className="mt-2">
                <h4>Developed by Shailesh Gaikwad</h4>
                <p className="text-center">
                  <i className="bi bi-c-circle-fill me-2"></i>
                  {currentTime.toLocaleDateString("en-GB", {
                    year: "numeric",
                  })}{" "}
                  All rights reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
