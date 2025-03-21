import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

export function AdminDashBoard() {
  const [Cookies, setCookies, removeCookie] = useCookies(["username"]);
  const [agents, setAgents] = useState([""]);
  const [searchclient, setSearchClient] = useState("");
  const [selectclient, setSelectClient] = useState(null);
  const [clients, setClients] = useState([
    {
      FirstName: "",
      LastName: "",
      Mobile: "",
      Email: "",
      AgentName: "",
      LoanAmount: 0,
      RateOfInterest: "",
      challan03: 0,
      challan05: 0,
      dhc: 0,
      IntimationCharges: 0,
      CreatedAt: new Date(),
    },
  ]);

  let navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.username) {
      navigate("/admin-login");
    }
  }, [Cookies.username, navigate]);

  const formik = useFormik({
    initialValues: {
      AgentName: "",
    },
    validationSchema: yup.object({
      AgentName: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
        .required("Agent name required")
        .min(1, "Name too short"),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post(`http://127.0.0.1:7575/add-agent`, values)
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: "Agent name added",
            draggable: true,
            timer: 1000,
          });
          resetForm();
          navigate("/admin-dashboard");
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            text: "Agent already exists",
          });
        });
    },
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:7575/get-clients")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.log(`Error in fetching clients `, error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:7575/get-agents`)
      .then((response) => {
        setAgents(response.data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  function handleSignOut() {
    //removeCookie("username");
    let timerInterval;
    Swal.fire({
      title: "Signing Out",
      html: `You will be signed out in <b></b> miliseconds`,
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval); // Now it will not give an error
      },
    }).then(() => {
      removeCookie("username");
      Swal.fire({
        title: "You have been signed out",
        text: "You have successfully log out.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/admin-login", { replace: true });
      });
    });
  }

  function handleDeleteClick() {
    Swal.fire({
      title: "Are You Sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:7575/delete-client/${selectclient._id}`);
        Swal.fire({
          text: "Client details deleted",
          title: "Deleted",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload(true);
        });
      }
    });
  }

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.FirstName} ${client.LastName}`.toLowerCase();
    return (
      fullName.includes(searchclient.toLowerCase()) ||
      fullName.includes(searchclient.toUpperCase()) ||
      client.AgentName.toLowerCase().includes(searchclient) ||
      client.AgentName.toUpperCase().includes(searchclient)
    );
  });
  //console.log("Filtered clients : ",filteredClients);

  return (
    <div>
      <div className="d-flex justify-content-between p-2 m-2">
        <p className="fw-semibold fs-5">Welcome {Cookies["username"]}</p>
        <div className="">
          <Tooltip title="Log Out" arrow placement="left">
            <Button onClick={handleSignOut} variant="contained" color="error">
              Log out
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="d-flex shadow border border-warning rounded-2 m-2 flex-column flex-md-row gap-3 p-3 justify-content-evenly">
        <Button
          className="animate__animated animate__backInDown"
          variant="contained"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          color="warning"
        >
          Add New Agent
        </Button>

        <Button
          className="animate__animated animate__backInDown"
          variant="contained"
          data-bs-toggle="modal"
          data-bs-target="#agent-modal"
          color="success"
        >
          Show All Agents
        </Button>

        {/* <Button className="animate__animated animate__backInDown" variant="contained" color="info">Show All Clients</Button> */}

        <div className="modal fade" id="agent-modal">
          <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable ">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title fs-4 text-uppercase text-primary fw-bold">
                  LIC HFl Agents{" "}
                  <span className="bi bi-house-heart-fill"></span>
                </div>
                <button
                  className="btn btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <p className="fs-5 fw-semibold">
                  Total Agents : <strong>{agents.length}</strong>
                </p>
                <div className="row justify-content-center">
                  {[...agents]
                    .sort((a, b) => a.AgentName.localeCompare(b.AgentName))
                    .map((agent) => (
                      <div
                        key={agent}
                        className="col-6 col-sm-3 col-md-3 col-lg-2 p-2"
                      >
                        <div className="fs-6 text-center">
                          <Card
                            variant="elevation"
                            className="p-2 mt-3 bg-info text-uppercase text-dark fw-semibold "
                          >
                            {agent.AgentName}
                          </Card>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title text-uppercase fs-5">
                  Add New Agent
                </div>
                <button
                  className="btn btn-close"
                  onClick={() => {
                    formik.resetForm();
                  }}
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    name="AgentName"
                    value={formik.values.AgentName}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "AgentName",
                        e.target.value.toUpperCase().trim()
                      );
                    }}
                    label="Agent Name"
                    fullWidth
                  ></TextField>
                  <span className="text-danger">{formik.errors.AgentName}</span>
                  <Button
                    type="submit"
                    className="mt-4 mb-3"
                    fullWidth
                    variant="contained"
                  >
                    Add agent
                  </Button>
                </form>
              </div>
              {/* <div className="modal-footer">
                        <Button variant="contained" color="error" data-bs-dismiss="modal" onClick={()=> formik.resetForm()}>Close</Button>
                    </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row justify-content-between m-3 p-2">
          <div className="fw-bold mb-3 fs-5">
            Total Customer : &nbsp;
            <span className="text-danger">
              {filteredClients.length > 0
                ? filteredClients.length
                : clients.length}
            </span>
          </div>

          <div className="d-flex justify-content-end col-md-4 fw-bold mb-2">
            <TextField
              placeholder="Enter client Name or Agent Name"
              size="medium"
              fullWidth
              color="secondary"
              label="search"
              value={searchclient}
              onChange={(e) => setSearchClient(e.target.value)}
              sx={{
                width: "50%",
                transformOrigin: "right",
                transition: "width 0.4s ease-in-out",
                "&:focus-within": { width: "100%" },
              }}
            />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-evenly bg-white shadow-lg mt-3 rounded-3">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(91, 89, 89, 0.2)",
                  },
                }}
                className="animate__animated animate__fadeInUp col-md-3 m-3 mt-4 rounded-3"
                key={client}
                variant="outlined"
              >
                <CardContent className="fw-semibold">
                  <Typography
                    className="text-start fw-semibold"
                    color="textDisabled"
                    variant="h6"
                  >
                    {client.FirstName} {client.LastName}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Mobile: {client.Mobile}
                  </Typography>
                  <Typography className="mt-1" variant="inherit" color="error">
                    Customer Email:
                  </Typography>
                  <Typography variant="inherit" color="warning">
                    {client.Email}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Agent Name: {client.AgentName}
                  </Typography>
                  <Typography
                    className="mt-1"
                    variant="inherit"
                    color="secondary"
                  >
                    Loan Amount:{" "}
                    {client.LoanAmount.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Rate of Interest: {client.RateOfInterest} %
                  </Typography>
                  <Typography className="mt-1" variant="inherit" color="error">
                    Challan 0.3 %:{" "}
                    {client.challan03.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography
                    className="mt-1"
                    variant="inherit"
                    color="success"
                  >
                    Challan 0.5 %:{" "}
                    {client.challan05.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography className="mt-1" variant="inherit" color="info">
                    DHC Charges: {client.dhc}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Intimation Charges: {client.IntimationCharges}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    {new Date(client.CreatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </CardContent>
                <CardActions className="d-flex justify-content-evenly mb-2">
                  <Link to={`/edit-detail/${client._id}`}>
                    <Button size="small" variant="outlined" color="secondary">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setSelectClient(client)}
                    size="small"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-delete"
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : searchclient.length > 0 ? (
            <p className="mt-2 fs-4 fw-semibold text-danger">
              Client or Agent not found : {searchclient}
            </p>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <Card
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(91, 89, 89, 0.2)",
                  },
                }}
                className="animate__animated animate__fadeInUp col-md-3 m-3 mt-4 rounded-3"
                key={client}
                variant="outlined"
              >
                <CardContent className="fw-semibold">
                  <Typography
                    className="text-start fw-semibold"
                    color="textDisabled"
                    variant="h6"
                  >
                    {client.FirstName} {client.LastName}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Mobile: {client.Mobile}
                  </Typography>
                  <Typography className="mt-1" variant="inherit" color="error">
                    Customer Email:
                  </Typography>
                  <Typography variant="inherit" color="warning">
                    {client.Email}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Agent Name: {client.AgentName}
                  </Typography>
                  <Typography
                    className="mt-1"
                    variant="inherit"
                    color="secondary"
                  >
                    Loan Amount:{" "}
                    {client.LoanAmount.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Rate of Interest: {client.RateOfInterest} %
                  </Typography>
                  <Typography className="mt-1" variant="inherit" color="error">
                    Challan 0.3 %:{" "}
                    {client.challan03.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography
                    className="mt-1"
                    variant="inherit"
                    color="success"
                  >
                    Challan 0.5 %:{" "}
                    {client.challan05.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography className="mt-1" variant="inherit" color="info">
                    DHC Charges: {client.dhc}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    Intimation Charges: {client.IntimationCharges}
                  </Typography>
                  <Typography className="mt-1" variant="inherit">
                    {new Date(client.CreatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </CardContent>
                <CardActions className="d-flex justify-content-evenly mb-2">
                  <Link to={`/edit-detail/${client._id}`}>
                    <Button size="small" variant="outlined" color="secondary">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setSelectClient(client)}
                    size="small"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-delete"
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <p className="text-danger fs-3 text-center">No clients found</p>
          )}

          <div className="modal fade" id="modal-delete">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-dark fw-semibold">
                  <div className="modal-title text-warning fs-5 bg-dark">
                    Are you sure ?
                  </div>
                  <button
                    className="btn btn-close bg-light"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  {selectclient ? (
                    <div className="text-uppercase text-dark text-center p-2 rounded-3 fs-6 fw-semibold">
                      <p>
                        Client Name : {selectclient.FirstName}{" "}
                        {selectclient.LastName}
                      </p>
                      <p>Agent : {selectclient.AgentName}</p>
                      <p>Loan Amount : {selectclient.LoanAmount}</p>
                      <p>Email : {selectclient.Email}</p>
                      <p>Mobile : {selectclient.Mobile}</p>
                    </div>
                  ) : (
                    <p class="text-danger">No clients found</p>
                  )}
                </div>
                <div className="d-flex justify-content-evenly modal-footer ">
                  <Button
                    onClick={() => handleDeleteClick(selectclient._id)}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                  <Button
                    data-bs-dismiss="modal"
                    variant="contained"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
