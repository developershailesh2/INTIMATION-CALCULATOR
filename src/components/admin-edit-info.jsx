import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";

export function AdminEdit() {
  const [Cookies] = useCookies(["username"]);
  const [details, setDetails] = useState([
    {
      FirstName: "",
      LastName: "",
      Mobile: "",
      Email: "",
    },
  ]);

  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.username) {
      navigate("/admin-login");
    }
  }, [Cookies.username, navigate]);

  const formik = useFormik({
    initialValues: {
      FirstName: details[0].FirstName,
      LastName: details[0].LastName,
      Mobile: details[0].Mobile,
      Email: details[0].Email,
    },
    validationSchema: yup.object({
      FirstName: yup
        .string()
        .required("First name required")
        .matches(/^[A-Za-z\s]+$/, "First Name can only contain alphabets"),
      LastName: yup
        .string()
        .required("Last name required")
        .matches(/^[A-Za-z\s]+$/, "Last Name can only contain alphabets"),
      Mobile: yup
        .string()
        .required("Mobile Number is required")
        .max(10, "Mobile Number cannot exceed 10 digits")
        .matches(
          /^\d{10}$/,
          "Mobile Number must be exactly 10 digits and contain only numbers"
        ),
      Email: yup
        .string()
        .required("Email required")
        .email("Please enter a valid email address")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Invalid email format (e.g., user@example.com)"
        ),
    }),
    onSubmit: (values) => {
      axios
        .put(`http://127.0.0.1:7575/edit-detail/${params._id}`, values)
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Details updated successfully",
            timer: 3000,
          });
          //console.log("Updated Successfully : ",response.data);
          navigate("/admin-dashboard");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:7575/get-details/${params._id}`)
      .then((response) => {
        setDetails(response.data);
      })
      .catch((error) => {
        console.error("Error in fething data", error);
      });
  }, [params._id]);

  return (
    <div className="d-flex justify-content-evenly min-vh-75 p-3 m-3 p-3">
      <div className="w-100  mt-4 border border-primary rounded-3">
        <div className="mt-4 text-center fw-semibold text-warning text-uppercase fs-4">
          Edit Details
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="row justify-content-evenly m-3 p-3"
        >
          <div className="col-md-6 mt-3 animate__animated animate__fadeInLeft">
            <TextField
              color="secondary"
              fullWidth
              label="First Name"
              name="FirstName"
              onChange={formik.handleChange}
              value={formik.values.FirstName}
            ></TextField>
            <span className="text-danger">{formik.errors.FirstName}</span>
          </div>

          <div className="col-md-6 mt-3 animate__animated animate__fadeInRight">
            <TextField
              color="secondary"
              fullWidth
              label="Last Name"
              name="LastName"
              onChange={formik.handleChange}
              value={formik.values.LastName}
            ></TextField>
            <span className="text-danger">{formik.errors.LastName}</span>
          </div>

          <div className="col-md-6 mt-3 animate__animated animate__fadeInLeft">
            <TextField
              color="secondary"
              fullWidth
              label="Mobile"
              name="Mobile"
              onChange={formik.handleChange}
              value={formik.values.Mobile}
            ></TextField>
            <span className="text-danger">{formik.errors.Mobile}</span>
          </div>

          <div className="col-md-6 mt-3 animate__animated animate__fadeInRight">
            <TextField
              color="secondary"
              label="Email"
              type="email"
              fullWidth
              name="Email"
              onChange={formik.handleChange}
              value={formik.values.Email}
              error={formik.errors.Email}
            ></TextField>
            {/* <span className="text-danger">{formik.errors.Email}</span> */}
          </div>

          <div className="d-flex flex-column flex-md-row col-12 justify-content-evenly mt-3">
            <Button type="submit" variant="contained" className="mt-3">
              Update
            </Button>
            <Link to="/admin-dashboard">
              <Button fullWidth variant="contained" className="mt-3">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
