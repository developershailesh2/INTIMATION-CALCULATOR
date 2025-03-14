import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";



export function AdminDashBoard() {
  const [Cookies, removeCookies] = useCookies(["username"]);
  const[agents , setAgents] = useState([''])
  const [clients , setClients] = useState([{
    FirstName : '',
    LastName : '',
    Mobile : '',
    Email : '',
    AgentName : '',
    LoanAmount : 0,
    RateOfInterest : '',
    challan03 : 0,
    challan05 : 0,
    dhc : 0,
    IntimationCharges : 0,
  }]);

  let navigate = useNavigate();

    const formik = useFormik({
        initialValues : {
            AgentName : ''
        },
        validationSchema : yup.object({
            AgentName : yup.string()
            .matches(/^[A-Za-z\s]+$/,"Only letters are allowed")
            .required("Agent name required").min(1,"Name too short")
        }),
        onSubmit : (values,{resetForm}) => {
            axios.post(`http://127.0.0.1:7575/add-agent`,values).then((response)=>{
                Swal.fire({
                    icon:"success",
                    text:"Agent name added",
                    draggable : true,
                    timer : 1000
                });
                resetForm();
                navigate("/admin-dashboard");
        }).catch(error => {
            Swal.fire({
            icon: "error",
            text: "Agent already exists",
            })
        })
        }
    })

    useEffect(()=>{
        axios.get("http://127.0.0.1:7575/get-clients").then((response)=>{
            setClients(response.data);
        }).catch(error => {console.log(`Error in fetching clients `,error)});
    },[])

    useEffect(()=>{
        axios.get(`http://127.0.0.1:7575/get-agents`).then((response)=>{
            setAgents(response.data);
        }).catch(error => {console.log("Error",error)});
    },[])

    function handleSignOut(){
        removeCookies("username");
        Swal.fire({
            position : 'center',
            icon:"success",
            text : "Log out successful",
            draggable: true,
            showConfirmButton:false,
            timer : 800
        });
        navigate("/admin-login");
    }

  return (
    <div>
      <div className="d-flex justify-content-between p-2 m-2">
        <p className="fw-semibold fs-5">Welcome {Cookies["username"]}</p>
        <div className="">
          <Button onClick={handleSignOut} variant="contained" color="error">
            Log out
          </Button>
        </div>
      </div>


        <div className="d-flex shadow-lg border border-warning rounded-2 m-2 flex-column flex-md-row gap-3 p-3 justify-content-evenly">
        
        
        <Button className="animate__animated animate__backInDown" variant="contained" data-bs-toggle="modal" data-bs-target="#modal" color="error">Add New Agent</Button>
        
        <Button className="animate__animated animate__backInDown" variant="contained" data-bs-toggle="modal" data-bs-target="#agent-modal" color="success">Show All Agents</Button>

        {/* <Button className="animate__animated animate__backInDown" variant="contained" color="info">Show All Clients</Button> */}
       
       

           <div className="modal fade" id="agent-modal">
                <div className="modal-dialog modal-xl modal-dialog-scrollable ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title fs-4 text-uppercase text-primary fw-bold">LIC HFl Agents <span className="bi bi-house-heart-fill"></span></div>
                            <button className="btn btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <p className="fs-5">Total Agents : <strong>{agents.length}</strong></p>
                            <div className="row justify-content-center">
                            {
                                [...agents].sort((a,b)=>a.AgentName.localeCompare(b.AgentName)).map
                                    ((agent)=>
                                        <div key={agent} className="col-6 col-sm-3 col-md-3 col-lg-2 p-2">
                                            <div className="fs-6 text-center">
                                                <Card variant="elevation" className="p-2 mt-3 bg-info text-uppercase text-dark fw-semibold ">{agent.AgentName}</Card>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
           </div>
           
           
            
            <div className="modal fade" id="modal">
                <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title text-uppercase fs-5">Add New Agent</div>
                        <button className="btn btn-close" onClick={()=>{formik.resetForm()}} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                         <form onSubmit={formik.handleSubmit}>
                            <TextField name="AgentName" value={formik.values.AgentName} onChange={(e)=>{formik.setFieldValue("AgentName",e.target.value.toUpperCase().trim())}} label="Agent Name" fullWidth></TextField>
                            <span className="text-danger">{formik.errors.AgentName}</span>
                            <Button type="submit" className="mt-4 mb-3" fullWidth variant="contained">Add agent</Button>
                        </form>
                    </div>
                    {/* <div className="modal-footer">
                        <Button variant="contained" color="error" data-bs-dismiss="modal" onClick={()=> formik.resetForm()}>Close</Button>
                    </div> */}
                </div>
                </div>
            </div>

        </div>

        <div className="container">
                
            <div className="mt-3 fw-bold">
                Total Customer : <span className="text-danger"> 
                    {clients.length}</span> 
            </div>
                        
            <div className="d-flex flex-wrap justify-content-center">

           
                {
                    clients.length > 0 ? (clients.map((client) => 
                        <Card className="animate__animated animate__fadeInUp col-md-3 m-2 p-2 mb-3 rounded-3 shadow" key={client} variant="outlined">
                    <Typography color="info" className="text-center bg-light fw-bold fs-5"> Customer Data </Typography>
                    <CardContent className="fw-semibold">
                            <Typography variant="inherit" color="warning">Customer Name : {client.FirstName} {client.LastName}  </Typography>
                            <Typography variant="inherit">Mobile : {client.Mobile} </Typography>
                            <Typography variant="inherit" color="primary">Email : {client.Email} </Typography>
                            <Typography variant="inherit">Agent Name : {client.AgentName} </Typography>
                            <Typography variant="inherit" color="secondary">Loan Amount : {client.LoanAmount} </Typography>
                            <Typography variant="inherit">Rate of Interest : {client.RateOfInterest} % </Typography>
                            <Typography variant="inherit" color="warning">Challan 0.3 % : {client.challan03} </Typography>
                            <Typography variant="inherit" color="warning">Challan 0.5 % : {client.challan05} </Typography>
                            <Typography variant="inherit" color="warning">DHC Charges : {client.dhc} </Typography>
                            <Typography variant="inherit">Intimation Charges : {client.IntimationCharges} </Typography>
    
                    </CardContent>
                    <CardActions className="d-flex justify-content-evenly">
                            <Button size="small" variant="contained" color="info">Edit</Button>
                            <Button size="small" variant="contained" color="error">Delete</Button>
                    </CardActions>
                </Card>)):(
                    <p className="text-danger fs-3 text-center">No clients found</p>
                )}
                
            
            </div>
       </div>
        
        </div>

    
  );
}
