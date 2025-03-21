import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";

export function AmountCalculator() {
  const [agents, setAgents] = useState("");

  const calculateChallan = (LoanAmount) => {
    LoanAmount = Number(LoanAmount);
    let challan03, challan05;
    const dhc = 300;

    //0.3 challan calculation
    if (LoanAmount <= 500000) {
      challan03 = LoanAmount * 0.001;
      challan03 = parseInt(challan03.toFixed(3));
    } else if (LoanAmount <= 3333333) {
      challan03 = LoanAmount * 0.003;
      //4 digit amount
      challan03 = parseInt(challan03.toFixed(4));
    } else {
      challan03 = LoanAmount * 0.003;
      //5 digit amount
      challan03 = parseInt(challan03.toFixed(5));
    }

    //0.5 challan calculation
    if (LoanAmount >= 3000000) {
      challan05 = 15000;
    } else if (LoanAmount >= 2000000) {
      challan05 = LoanAmount * 0.005;
      //5 digit amount
      challan05 = parseInt(challan05.toFixed(5));
    } else {
      challan05 = LoanAmount * 0.005;
      //4 digit amount
      challan05 = parseInt(challan05.toFixed(4));
    }

    return { challan03, challan05, dhc };
  };

  const formik = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      Mobile: "",
      Email: "",
      AgentName: "",
      LoanAmount: 0,
      RateOfInterest: "",
      IntimationCharges: "",
      challan03: 0,
      challan05: 0,
      dhc: 300,
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
      AgentName: yup.string().required("Please select an agent name"),
      LoanAmount: yup
        .number()
        .required("Loan amount required")
        .min(100000, "Loan Amount must be at least ₹1,00,000"),
      RateOfInterest: yup
        .string()
        .required("Rate of interest is required")
        .matches(
          /^\d*\.?\d+$/,
          "Rate of Interest must be a valid numeric value"
        ),
      IntimationCharges: yup
        .number()
        .required("Intimation charges are required")
        .positive("Intimation charges must be a positive number")
        .min(600, "Intimation charges must be at least ₹600")
        .typeError("Intimation Charges must be a valid number"),
    }),
    onSubmit: (calculate, { resetForm }) => {
      const LoanAmount = calculate.LoanAmount;
      const charges = calculateChallan(LoanAmount);
      let IntimationCharges = calculate.IntimationCharges;
      let FirstName = calculate.FirstName;
      let LastName = calculate.LastName;

      const totalAmount =
        charges.challan03 + charges.challan05 + charges.dhc + IntimationCharges;
      const footerText = `
Client Name : ${FirstName} ${LastName} 

Loan Amount : ${LoanAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })} 
            
0.3 % Challan : ${charges.challan03} 
            
0.5 % Challan : ${charges.challan05} 

DHC Charges : ${charges.dhc} 

Intimation Charges : ${IntimationCharges} 

Total Amount : ${totalAmount.toLocaleString()}`;

      axios
        .post(`http://127.0.0.1:7575/calculate-amount`, {
          ...calculate,
          ...charges,
        })
        .then((response) => {
          let timerInterval;
          Swal.fire({
            title: "Processing request",
            html: "Please wait calculating amount <b></b>",
            timer: 2000,
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
            Swal.fire({
              showConfirmButton: false,
              icon: "success",
              title: "Calculation Successful!",
              text: "The amount has been successfully calculated ",
              html: `
            <p><strong>${footerText}</strong></p>
            <button class="swal2-confirm swal2-styled" id="copyButton">Copy</button>
        `,
              didOpen: () => {
                document
                  .getElementById("copyButton")
                  .addEventListener("click", () => {
                    navigator.clipboard
                      .writeText(footerText)
                      .then(() => {
                        const Toast = Swal.mixin({
                          toast: true,
                          position: "top-end",
                          timer: 2000,
                          timerProgressBar: true,
                          showConfirmButton: false,
                        });
                        Toast.fire({
                          icon: "success",
                          title: "Copied successfully",
                        }).then(() => {
                          window.location.reload(true);
                        });
                      })
                      .catch((error) => {
                        console.error("Error in copying data", error);
                      });
                  });
              },
            });
          });

          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:7575/get-agents`)
      .then((response) => {
        setAgents(response.data);
      })
      .catch((error) => {
        console.log("Error in fetching agents", error);
      });
  }, []);

  return (
    <div className="d-flex justify-content-evenly min-vh-100 p-2">
      <div className="mt-4 w-100 shadow-lg rounded-4">
        <form
          onSubmit={formik.handleSubmit}
          className="row justify-content-evenly p-3 m-3"
        >
          <div className="text-center mt-4 mb-2 text-danger fw-bold fs-4">
            <Typewriter
              options={{
                strings: ["Intimation Calculator", "Calculate Customer Bill"],
                autoStart: true,
                loop: true,
                delay: 50,
              }}
            ></Typewriter>
          </div>
          <Typography className="text-center text-muted mb-4">
            <Typewriter
              options={{
                strings: ["Welcome", "Please enter customer details"],
                autoStart: true,
                loop: true,
                delay: 30,
                deleteSpeed: 50,
              }}
            ></Typewriter>
          </Typography>
          <div className=" col-md-5 mb-3 animate__animated animate__fadeInLeft">
            <TextField
              fullWidth
              variant="outlined"
              label="First Name"
              name="FirstName"
              className="text-uppercase"
              error={formik.errors.FirstName}
              onChange={(e) => {
                formik.setFieldValue("FirstName", e.target.value.toUpperCase());
              }}
            ></TextField>
            <span className="text-danger">{formik.errors.FirstName}</span>
          </div>
          <div className="col-md-5 mb-3 ">
            <TextField
              error={formik.errors.LastName}
              className="animate__animated animate__slideInRight"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                formik.setFieldValue("LastName", e.target.value.toUpperCase());
              }}
              label="Last Name"
              name="LastName"
            ></TextField>
            <span className="text-danger">{formik.errors.LastName}</span>
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              error={formik.errors.Mobile}
              label="Mobile"
              onChange={formik.handleChange}
              name="Mobile"
            ></TextField>
            <span className="text-danger">{formik.errors.Mobile}</span>
          </div>

          <div className="col-md-5 mb-3 ">
            <TextField
              type="email"
              className="animate__animated animate__slideInRight"
              fullWidth
              error={formik.errors.Email}
              variant="outlined"
              label="Email"
              name="Email"
              onChange={(e) => {
                formik.setFieldValue("Email", e.target.value.toLowerCase());
              }}
            ></TextField>
            <span className="text-danger">{formik.errors.Email}</span>
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
            <FormControl fullWidth>
              <InputLabel id="agent-name">Agent Name</InputLabel>
              <Select
                className="text-uppercase"
                error={formik.errors.AgentName}
                onChange={(event) => {
                  formik.setFieldValue("AgentName", event.target.value);
                }}
                labelId="agent-name"
                label="agent-name"
                name="AgentName"
                value={formik.values.AgentName}
              >
                {agents.length > 0 ? (
                  agents.map((agent) => (
                    <MenuItem value={agent.AgentName} key={agent.AgentName}>
                      {agent.AgentName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No agents found</MenuItem>
                )}
              </Select>
            </FormControl>
            <span className="text-danger">{formik.errors.AgentName}</span>
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__slideInRight">
            <TextField
              type="number"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              label="Loan Amount"
              error={formik.errors.LoanAmount}
              name="LoanAmount"
            ></TextField>
            <span className="text-danger">{formik.errors.LoanAmount}</span>
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
            <TextField
              onChange={formik.handleChange}
              label="Rate Of Interest"
              fullWidth
              error={formik.errors.RateOfInterest}
              name="RateOfInterest"
            >
              Rate of Interest
            </TextField>
            <span className="text-danger">{formik.errors.RateOfInterest}</span>
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInRight">
            <TextField
              label="Intimation Charges"
              type="number"
              name="IntimationCharges"
              error={formik.errors.IntimationCharges}
              onChange={formik.handleChange}
              fullWidth
            >
              Intimation Charges
            </TextField>
            <span className="text-danger">
              {formik.errors.IntimationCharges}
            </span>
          </div>

          {/* <div className="col-md-5 mb-3 mt-2 animate__animated animate__rubberBand">
                        <Button 
                        type="submit" 
                         
                        variant="contained"
                        color="success"
                        >Calculate</Button>
                    </div>

                    <div className="col-md-5 mb-3 d-flex flex-column flex-md-row justify-content-around mt-2 animate__animated animate__rubberBand">
                        <Link to="/">
                        <Button  
                        variant="contained"
                        color="info"
                        >Home</Button></Link>
                    </div> */}

          <div className="col-md-12 d-flex flex-column flex-md-row justify-content-around  ">
            <Button
              type="submit"
              className="mt-3"
              variant="contained"
              color="warning"
              sx={{ backgroundColor: "#6200ee" }}
            >
              Calculate
            </Button>

            <Button
              to="/"
              LinkComponent={Link}
              className="mt-3"
              variant="contained"
              color="error"
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
