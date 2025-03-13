import { Button, TextField } from "@mui/material";
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
  let navigate = useNavigate();

    const formik = useFormik({
        initialValues : {
            AgentName : ''
        },
        validationSchema : yup.object({
            AgentName : yup.string()
            .matches(/^[A-Za-z\s]+$/,"Only letters are allowed")
            .required("Agent name required").min(2,"Name too short")
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
        axios.get(`http://127.0.0.1:7575/get-agents`).then((response)=>{
            setAgents(response.data);
        }).catch(error => {console.log("Error",error)});
    },[])

    function handleSignOut(){
        removeCookies("username");
        Swal.fire({
            icon:"success",
            text : "Log out successful",
            draggable: true,
            timer : 1000
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


        <div className="d-flex flex-column justify-content-center m-1">
           
           <div className="col-md-12 p-2 shadow-lg rounded p-3">
           <Button variant="contained" data-bs-toggle="modal" data-bs-target="#modal" color="warning">Add Agent</Button>
           
           
           <div className="row mt-3">
            <p className="fs-6 text-uppercase">Total Agents : <b>{agents.length}</b></p>
                {
                    agents.map((agent)=>
                    <Button variant="outlined" color="secondary" className="col-md-2 mx-4 mb-2 shadow">{agent.AgentName}</Button>)
                }
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
                            <TextField name="AgentName" value={formik.values.AgentName} onChange={(e)=>{formik.setFieldValue("AgentName",e.target.value.toUpperCase())}} label="Agent Name" fullWidth></TextField>
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

    </div>
  );
}
