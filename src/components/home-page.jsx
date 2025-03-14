import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import {useFormik} from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export function HomePage() {

    const [agents , setAgents] = useState('');

    const calculateChallan = (LoanAmount) => {
        LoanAmount = Number(LoanAmount);
        let challan03 , challan05 ;
        const dhc = 300;

        //0.3 challan calculation
        if(LoanAmount <= 500000){
            challan03 = LoanAmount * 0.001;
            challan03.toFixed(3);
        } else if(LoanAmount <= 3333333) {
            challan03 = LoanAmount * 0.003;
            //4 digit amount
            challan03.toFixed(4);
        } else {
            challan03 = LoanAmount * 0.003;
            //5 digit amount
            challan03.toFixed(5);
        }

        //0.5 challan calculation
        if(LoanAmount >= 3000000){
            challan05 = 15000;
        } else if(LoanAmount >= 2000000) {
            challan05 = LoanAmount * 0.005;
            //5 digit amount
            challan05.toFixed(5);
        } else {
            challan05 = LoanAmount * 0.005;
            //4 digit amount
            challan05.toFixed(4);
        }

        return {challan03 , challan05, dhc};
    }

    const formik = useFormik({
        initialValues : {
            FirstName : '',
            LastName : '',
            Mobile : '',
            Email : '',
            AgentName : '',
            LoanAmount : 0,
            RateOfInterest : '',
            IntimationCharges :'',
            challan03 : 0,
            challan05 : 0,
            dhc : 300
        },
        validationSchema : yup.object({
            FirstName : yup.string().required("First name required"),
            LastName : yup.string().required("Last name required"),
            Mobile : yup.string().required("Mobile number required")
            .min(10,"Can't be less than 10 digits")
            .max(10,"Can't be more than 10 digits")
            .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
            Email : yup.string().required("Email required").email("Invalid format")
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"Invalid email format (e.g., user@example.com)")
            ,
            AgentName : yup.string().required("Select agent name"),
            LoanAmount : yup.number().required("Loan amount required").min(100000,"Amount can't be less than 1,00,000"),
            RateOfInterest : yup.string().required("Rate of interest required").matches(/^\d*\.?\d+$/,"Only Numbers are allowed"),
            IntimationCharges : yup.number().required("Intimation charges required")
        }),
        onSubmit: (calculate , {resetForm}) => {

            const LoanAmount = calculate.LoanAmount;
            const charges = calculateChallan(LoanAmount);
            let IntimationCharges = calculate.IntimationCharges;
            let FirstName = calculate.FirstName;
            let LastName = calculate.LastName;

            const totalAmount = charges.challan03 + charges.challan05 + charges.dhc + IntimationCharges;
            const footerText = `
            Client Name  : ${FirstName} ${LastName}
            Loan Amount  : ${LoanAmount.toLocaleString("en-IN",{maximumFractionDigits : 2})}
            0.3 % Challan : ${charges.challan03} 
            0.5 % Challan : ${charges.challan05} 
            DHC Charges : ${charges.dhc} 
            Intimation Charges : ${IntimationCharges}
            Total Amount : ${totalAmount.toLocaleString()}
            `

            axios.post(`http://127.0.0.1:7575/calculate-amount`,{...calculate , ...charges}).then((response)=>{

                Swal.fire({
                    showConfirmButton : false,
                    icon : "success",
                    text : "Amount calculated & saved in database",
                    html : `
                        <p><strong>${footerText}</strong></p>
                        <button class="swal2-confirm swal2-styled" id="copyButton">Copy</button>
                    `,
                    didOpen : () => {
                        document.getElementById("copyButton").addEventListener("click",()=>{
                            navigator.clipboard.writeText(footerText);
                            Swal.fire("Copied","Success")
                        });
                    }
                    //footer : `Total : `+(charges.challan03 + charges.challan05 + charges.dhc + IntimationCharges).toLocaleString()
                });
                resetForm();
            }).catch((error)=>{console.log(error)});
        }
    })

    
    useEffect(()=>{

        axios.get(`http://127.0.0.1:7575/get-agents`).then((response)=>{
            setAgents(response.data);
        }).catch(error => {console.log("Error in fetching agents",error);})
    },[])


    return(
        <div className="d-flex justify-content-evenly min-vh-100 p-2">
              
            <div className="mt-3 mb-3 w-100 shadow-lg rounded-4">
                <form onSubmit={formik.handleSubmit} className="row justify-content-evenly p-3 m-3">
                
                <div className="animate__animated animate__backInLeft text-center mt-4 mb-2 text-danger fw-bold fs-4">Intimation Calculator</div>

                
                <Typography className="text-center text-muted mb-4 animate__animated animate__backInRight">Welcome! Please enter customer details</Typography>
                
                
                <div className=" col-md-5 mb-3 animate__animated animate__fadeInLeft">
                
                <TextField 
                fullWidth 
                    variant="outlined" 
                    label="First Name"
                    name="FirstName"
                    className="text-uppercase"
                    onChange={(e)=>{formik.setFieldValue("FirstName",e.target.value.toUpperCase());}}
                >

                </TextField>
                <span className="text-danger">{formik.errors.FirstName}</span>
                    </div>

                    <div className="col-md-5 mb-3 ">
                    <TextField 
                    className="animate__animated animate__slideInRight"
                    fullWidth 
                    variant="outlined" 
                    onChange={(e)=>{formik.setFieldValue("LastName",e.target.value.toUpperCase());}}
                    label="Last Name"
                    name="LastName"
                >
                </TextField>
                <span className="text-danger">{formik.errors.LastName}</span>
                    </div>

                    <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
                    <TextField fullWidth 
                variant="outlined" 
                label="Mobile"
                onChange={formik.handleChange}
                name="Mobile"
                >
                </TextField>
                <span className="text-danger">{formik.errors.Mobile}</span>
                    </div>

                    <div className="col-md-5 mb-3 ">
                    <TextField type="email" 
                className="animate__animated animate__slideInRight"
                fullWidth 
                variant="outlined" 
                label="Email"
                name="Email"
                onChange={(e)=>{formik.setFieldValue("Email",e.target.value.toLowerCase());}}
                >
                </TextField>
                <span className="text-danger">{formik.errors.Email}</span>
                    </div>

                    <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
                     <FormControl fullWidth>
                        <InputLabel id="agent-name">Agent Name</InputLabel>
                        <Select
                        className="text-uppercase"
                        onChange={(event)=>{formik.setFieldValue("AgentName",event.target.value)}}
                        labelId="agent-name"
                        label="agent-name"
                        name="AgentName"
                        value={formik.values.AgentName}
                        >
                        
                            {
                                agents.length>0 ? (
                                    agents.map((agent)=>
                                    <MenuItem value={agent.AgentName} key={agent.AgentName} >{agent.AgentName}</MenuItem>)
                                ):(<MenuItem disabled>No agents found</MenuItem>)
                            }
                        
                        
                        </Select>
                   </FormControl>
                   <span className="text-danger">{formik.errors.AgentName}</span>
                    </div>

                    <div className="col-md-5 mb-3 animate__animated animate__slideInRight">
                    <TextField type="number" fullWidth
                variant="outlined" 
                onChange={formik.handleChange}
                label="Loan Amount"
                name="LoanAmount"
                >
                </TextField>
                <span className="text-danger">{formik.errors.LoanAmount}</span>
                    </div>

                <div className="col-md-5 mb-3 animate__animated animate__fadeInLeft">
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

                <div className="col-md-5 mb-3 animate__animated animate__fadeInRight">
                    <TextField label="Intimation Charges"
                    type="number" 
                    name="IntimationCharges"
                    onChange={formik.handleChange} 
                    fullWidth>
                        Intimation Charges
                    </TextField>
                    <span className="text-danger">{formik.errors.IntimationCharges}</span>
                </div>

                    <div className="col-md-5 mb-3 mt-2 animate__animated animate__rubberBand">
                        <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained"
                        color="success"
                        >Calculate</Button>
                    </div>

                    <div className="col-md-5 mb-3 mt-2 animate__animated animate__rubberBand">
                        <Link to="/admin-login">
                        <Button fullWidth 
                        variant="contained"
                        color="info"
                        >Admin Login</Button></Link>
                    </div>

                </form>
            </div>

        </div>
    )
}