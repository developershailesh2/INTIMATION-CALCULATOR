import {
  Button,
  FormControl,
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
    <div className="d-flex justify-content-evenly p-2">
      <div className="w-auto m-3 rounded-3">
        <form
          onSubmit={formik.handleSubmit}
          className="row justify-content-evenly rounded-3 pb-4"
          style={{backgroundColor:"#f9f9f9"}}
        >
          <div className="text-center mt-4 mb-3 text-danger fw-bold fs-4">
            <Typewriter
              options={{
                strings: ["Intimation Calculator", "Calculate Customer Bill"],
                autoStart: true,
                loop: true,
                delay: 100,
              }}
            ></Typewriter>
          </div>
          {/* <Typography className="text-center text-muted mb-4">
            <Typewriter
              options={{
                strings: ["Welcome", "Please enter customer details"],
                autoStart: true,
                loop: true,
                delay: 30,
                deleteSpeed: 50,
              }}
            ></Typewriter>
          </Typography> */}
          <div className="text-center fw-bold mb-4" style={{color : "#11243A" , fontSize:"26px" , fontFamily:"sans-serif , inter"}}>Please fill customer basic details</div>
          
          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
            <label htmlFor="FirstName" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>First Name</label>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter First Name"
              name="FirstName"
              className="text-uppercase bg-white"
              error={formik.touched.FirstName && Boolean(formik.errors.FirstName)}
              onBlur={()=>{if(formik.values.FirstName){formik.setFieldTouched("FirstName",true)}}}
              onChange={(e) => {
                formik.setFieldValue("FirstName", e.target.value.toUpperCase());
              }}
            ></TextField>
            {formik.touched.FirstName && formik.errors.FirstName && (<span className="text-danger">{formik.errors.FirstName}</span>)}
            
          </div>
          <div className="col-md-5 mb-3 ">
          <label htmlFor="FirstName" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Last Name</label>
            <TextField
              error={formik.touched.LastName && Boolean(formik.errors.LastName)}
              onBlur={()=>{if(formik.values.LastName){formik.setFieldTouched("LastName",true)}}}
              className="animate__animated animate__slideInRight bg-white"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                formik.setFieldValue("LastName", e.target.value.toUpperCase());
              }}
              placeholder="Enter Last Name"
              name="LastName"
            ></TextField>
             {formik.touched.LastName && formik.errors.LastName && (<span className="text-danger">{formik.errors.LastName}</span>)}
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
          <label htmlFor="Mobile" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Mobile</label>
            <TextField
            className="bg-white"
              fullWidth
              type="text"
              variant="outlined"
              error={formik.touched.Mobile && Boolean(formik.errors.Mobile)}
              onBlur={()=>{if(formik.values.Mobile){formik.setFieldTouched("Mobile",true)}}}
              placeholder="Enter Mobile Number"
              onChange={formik.handleChange}
              name="Mobile"
            ></TextField>
             {formik.touched.Mobile && formik.errors.Mobile && (<span className="text-danger">{formik.errors.Mobile}</span>)}
          </div>

          <div className="col-md-5 mb-3 ">
          <label htmlFor="Email" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Email</label>
            <TextField
              type="email"
              className="animate__animated animate__slideInRight bg-white"
              fullWidth
              error={formik.touched.Email && Boolean(formik.errors.Email)}
              onBlur={()=>{if(formik.values.Email){formik.setFieldTouched("Email",true)}}}
              variant="outlined"
              placeholder="Enter Email Id"
              name="Email"
              onChange={(e) => {
                formik.setFieldValue("Email", e.target.value.toLowerCase());
              }}
            ></TextField>
             {formik.touched.Email && formik.errors.Email && (<span className="text-danger">{formik.errors.Email}</span>)}
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
          <label htmlFor="AgentName" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Agent Name</label>
            
            <FormControl fullWidth>
              
              <Select
              displayEmpty
                placeholder="Select Agent"
                className="text-uppercase bg-white"
                error={formik.touched.AgentName && Boolean(formik.errors.AgentName)}
                onBlur={()=>{if(formik.values.AgentName){formik.setFieldTouched("AgentName",true)}}}
                onChange={(event) => {
                  formik.setFieldValue("AgentName", event.target.value);
                }}               
                name="AgentName"
                value={formik.values.AgentName}
                renderValue={formik.values.AgentName !== "" ? undefined : ()=><span style={{color: "#aaa" , textTransform:"capitalize"}}>Select Agent Name</span>}
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
            {formik.touched.AgentName && formik.errors.AgentName && (<span className="text-danger">{formik.errors.AgentName}</span>)}
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__slideInRight">
          <label htmlFor="LoanAmount" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Loan Amount</label>
            <TextField
              type="number"
              fullWidth
              variant="outlined"
              className="bg-white"
              onChange={formik.handleChange}
              placeholder="Enter Loan Amount"
              error={formik.touched.LoanAmount && Boolean(formik.errors.LoanAmount)}
              onBlur={()=>{if(formik.values.LoanAmount){formik.setFieldTouched("LoanAmount",true)}}}
              name="LoanAmount"
            ></TextField>
             {formik.touched.LoanAmount && formik.errors.LoanAmount && (<span className="text-danger">{formik.errors.LoanAmount}</span>)}
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
          <label htmlFor="AgentName" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Rate Of Interest</label>
            <TextField
              onChange={formik.handleChange}
              placeholder="Enter Rate Of Interest"
              fullWidth
              className="bg-white"
              error={formik.touched.RateOfInterest && Boolean(formik.errors.RateOfInterest)}
              onBlur={()=>{if(formik.values.RateOfInterest){formik.setFieldTouched("RateOfInterest",true)}}}
              name="RateOfInterest"
            >
              Rate of Interest
            </TextField>
            {formik.touched.RateOfInterest && formik.errors.RateOfInterest && (<span className="text-danger">{formik.errors.RateOfInterest}</span>)}
          </div>

          <div className="col-md-5 mb-3 animate__animated animate__fadeInRight">
          <label htmlFor="AgentName" className="mt-3 mb-3" style={{fontFamily:"sans-serif , inter", fontSize:"15px" , color:"#333333"}}>Intimation Charges</label>
            <TextField
              placeholder="Enter Intimation Charges"
              type="number"
              className="bg-white"
              name="IntimationCharges"
              error={formik.touched.IntimationCharges && Boolean(formik.errors.IntimationCharges)}
              onBlur={()=>{if(formik.values.IntimationCharges){formik.setFieldTouched("IntimationCharges",true)}}}
              onChange={formik.handleChange}
              fullWidth
            >
              Intimation Charges
            </TextField>
            {formik.touched.IntimationCharges && formik.errors.IntimationCharges && (<span className="text-danger">{formik.errors.IntimationCharges}</span>)}
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
              style={{
                backgroundColor : "#58B94A",
                fontSize:"15px",
                fontFamily:"sans-serif"
              }}
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
