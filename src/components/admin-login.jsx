import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { Cookies, useCookies } from "react-cookie";

export function AdminLogin() {
  const [cookies, setCookies] = useCookies([Cookies["username"]]);

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
        console.log(user);
        if (user) {
          if (admin.Password === user.Password) {
            setCookies("username", user.UserName);
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              draggable: true,
            });
            navigate("/admin-dashboard");
          } else {
            Swal.fire({
              icon: "error",
              text: "Invalid Password",
              draggable: true,
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Invalid Username",
            draggable: true,
          });
        }
      });
    },
  });

  return (
    //<div className="text-primary h3">Admin Login</div>
    <div className="d-flex justify-content-center align-items-center min-vh-90">
      <div className="w-75 p-3">
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

          <div className="col-md-8 mt-2 mb-3">
            <TextField
              label="User Name *"
              // className="form-control"
              fullWidth
              color="secondary"
              name="UserName"
              onChange={formik.handleChange}
            >
              User Name
            </TextField>
            <span className="text-danger">{formik.errors.UserName}</span>
          </div>

          <div className="col-md-8 mt-2 mb-3">
            <TextField
              type="password"
              fullWidth
              color="secondary"
              label="Password *"
              name="Password"
              onChange={formik.handleChange}
            >
              {" "}
              Password*
            </TextField>
            <span className="text-danger">{formik.errors.Password}</span>
          </div>

          {/* Buttons */}
          <div className="col-md-8 d-flex justify-content-center gap-3">
            <Button
              type="submit"
              variant="outlined"
              className="fw-bold mt-2 mb-3 w-50"
            >
              Login
            </Button>

            <Link to="/" className="w-50 text-decoration-none">
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                className="mt-2 mb-3"
              >
                Back
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
