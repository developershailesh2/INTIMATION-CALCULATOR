import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";

export function HomePage() {


    const formik = useFormik({
        initialValues : {
            FirstName : '',
            LastName : '',
            Mobile : '',
            Email : '',
            AgentName : '',
            LoanAmount : '',
            RateOfInterest : '',
            IntimationCharges :''
        },
        validationSchema : yup.object({
            FirstName : yup.string().required("First name required"),
            LastName : yup.string().required("Last name required"),
            Mobile : yup.string().required("Mobile number required").
            min(10,"Can't be less than 10 digits")
            .max(10,"Can't be more than 10 digits")
            .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
            Email : yup.string().required("Email required").email("Invalid format")
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"Invalid email format (e.g., user@example.com)")
            ,
            AgentName : yup.string().required("Select agent name"),
            LoanAmount : yup.number().required("Loan amount required").min(100000,"Amount can't be less than 100000"),
            RateOfInterest : yup.number().required("Rate of interest required"),
            IntimationCharges : yup.string().required("Intimation charges required")
        }),
        onSubmit: (calculate) => {

        }
    })


    function CalculateFees(){

    }

    return(
        <div className="d-flex justify-content-evenly min-vh-100 p-2">
              
            <div className="mt-3 mb-3 w-100 shadow-lg rounded-4">
                <form onSubmit={formik.handleSubmit} className="row justify-content-evenly p-3 m-3">
                
                <div className=" text-center mb-4 fw-bold fs-4">Intimation Calculator</div>

                
                <Typography className="text-center text-muted mb-4">Welcome! Please enter your details</Typography>
                
                
                <div className=" col-md-5 mb-3">
                
                <TextField 
                fullWidth 
                    variant="outlined" 
                    label="First Name"
                    name="FirstName"
                    onChange={formik.handleChange}
                >

                </TextField>
                <span className="text-danger">{formik.errors.FirstName}</span>
                    </div>

                    <div className="col-md-5 mb-3">
                    <TextField 
                    fullWidth 
                    variant="outlined" 
                    onChange={formik.handleChange}
                    label="Last Name"
                    name="LastName"
                >
                </TextField>
                <span className="text-danger">{formik.errors.LastName}</span>
                    </div>

                    <div className="col-md-5 mb-3">
                    <TextField fullWidth 
                variant="outlined" 
                label="Mobile"
                onChange={formik.handleChange}
                name="Mobile"
                >
                </TextField>
                <span className="text-danger">{formik.errors.Mobile}</span>
                    </div>

                    <div className="col-md-5 mb-3">
                    <TextField type="email" fullWidth 
                variant="outlined" 
                label="Email"
                name="Email"
                onChange={formik.handleChange}
                >
                </TextField>
                <span className="text-danger">{formik.errors.Email}</span>
                    </div>

                    <div className="col-md-5 mb-3">
                   <FormControl fullWidth>
                        <InputLabel id="agent-name">Agent Name</InputLabel>
                        <Select
                        className="text-uppercase"
                        onChange={formik.handleChange}
                        labelId="agent-name"
                        label="agent-name"
                        name="AgentName"
                        >
                        <MenuItem value="10">Avinash Bokade</MenuItem>
                        <MenuItem value="20">Akshay Borkar</MenuItem>
                        <MenuItem value="30">Shankar Tarale</MenuItem>
                        <MenuItem value="40">Onkar Jadhao</MenuItem>
                        <MenuItem value="50">Rajeev Bhute</MenuItem>
                        <MenuItem value="60">Shrikant Bobade</MenuItem>
                        <MenuItem value="70">Ganesh Tambe</MenuItem>
                        </Select>
                   </FormControl>
                   <span className="text-danger">{formik.errors.AgentName}</span>
                    </div>

                    <div className="col-md-5 mb-3">
                    <TextField type="number" fullWidth
                variant="outlined" 
                onChange={formik.handleChange}
                label="Loan Amount"
                name="LoanAmount"
                >
                </TextField>
                <span className="text-danger">{formik.errors.LoanAmount}</span>
                    </div>

                <div className="col-md-5 mb-3">
                    <TextField
                     onChange={formik.handleChange}
                    label="Rate Of Interest"
                    fullWidth
                    name="RateOfInterest"
                    >
                        Rate of Interest
                    </TextField>
                    <span className="text-danger">{formik.errors.RateOfInterest}</span>
                </div>

                <div className="col-md-5 mb-3">
                    <TextField label="Intimation Charges" 
                    name="IntimationCharges"
                    onChange={formik.handleChange} fullWidth>
                        Intimation Charges
                    </TextField>
                    <span className="text-danger">{formik.errors.IntimationCharges}</span>
                </div>

                    <div className="col-md-5 mb-3 mt-2">
                        <Button type="submit" fullWidth 
                        variant="outlined"
                        color="success"
                        >Calculate</Button>
                    </div>

                    <div className="col-md-5 mb-3 mt-2">
                        <Button type="reset" fullWidth 
                        variant="outlined"
                        color="error"
                        >Reset</Button>
                    </div>

                </form>
            </div>

        </div>
    )
}