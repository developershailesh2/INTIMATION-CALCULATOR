import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Cookies, useCookies } from "react-cookie";

export function AdminLogin() {
  const [cookies, setCookies] = useCookies(["username"]);

  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      UserName: "",
      Password: "",
    },
    validationSchema: yup.object({
      UserName: yup.string().required("Username required"),
      Password: yup.string().required("Password required"),
    }),
    onSubmit: (admin) => {
      axios.get(`http://127.0.0.1:7575/get-admin`).then((response) => {
        var user = response.data.find(
          (item) => item.UserName === admin.UserName
        );
        if (user) {
          if (admin.Password === user.Password) {
            let timerInterval;
            Swal.fire({
              html: "Please wait, signing in <b></b> miliseconds",
              title: "Signing In...",
              timer: 800,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then(() => {
              setCookies("username", user.UserName);
              navigate("/admin-dashboard");
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Signed in successfully",
              }).then(() => {
                window.location.reload(true);
              });

              // Swal.fire({
              //   icon: "success",
              //   title: "Welcome Back!",
              //   showConfirmButton: false,
              //   text: "You have successfully signed in",
              //   timer: 1000,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Access Denied",
              text: "The password you entered is incorrect.",
              draggable: true,
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "User Not Found",
            text: "No account exists with this username. Please check and try again.",
          });
        }
      });
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-90">
      <div className="w-75 p-3 mt-5">
        <form
          onSubmit={formik.handleSubmit}
          className="animate__animated animate__bounceInLeft row justify-content-center align-items-center border border-danger mt-5 rounded-2 p-3 "
        >
          <div className="animate__animated animate__fadeInUp text-danger text-center  mb-3 fw-bold fs-3">
            Sign in to Admin
          </div>
          <p className="text-center text-muted">
            Welcome Admin, please sign in to continue
          </p>

          <div className="col-md-8 mt-2 mb-3 animate__animated animate__slideInLeft">
            <TextField
              label="User Name *"
              // className="form-control"
              fullWidth
              color="secondary"
              name="UserName"
              error={formik.errors.UserName}
              onChange={formik.handleChange}
            >
              User Name
            </TextField>
            <span className="text-danger">{formik.errors.UserName}</span>
          </div>

          <div className="col-md-8 mt-2 mb-3 animate__animated animate__slideInRight">
            <TextField
              type="password"
              fullWidth
              color="secondary"
              label="Password *"
              error={formik.errors.Password}
              name="Password"
              onChange={formik.handleChange}
            >
              {" "}
              Password*
            </TextField>
            <span className="text-danger">{formik.errors.Password}</span>
          </div>

          <div className="col-md-8 d-flex flex-column flex-md-row justify-content-around ">
            <Button
              type="submit"
              variant="contained"
              className="mt-2 mb-3"
              color="error"
            >
              Login
            </Button>

            <Button
              to="/"
              LinkComponent={Link}
              variant="contained"
              color="secondary"
              className="mt-2 mb-3"
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
