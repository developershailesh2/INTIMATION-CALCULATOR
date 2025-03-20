var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
const { ObjectId } = require("mongodb");

var app = express();
// cors is required for handling request methods like POST , PUT , Delete

app.use(cors());
// Required for converting data into JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connectionString = "mongodb://127.0.0.1:27017";

//API Routes

app.get("/get-admin", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    database
      .collection("tbladmin")
      .find({})
      .toArray()
      .then((document) => {
        res.send(document);
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post("/add-agent", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    var agentname = {
      AgentName: req.body.AgentName.toUpperCase().trim(),
      CreatedAt: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    };
    //checking that if agent already exists

    database
      .collection("tblagents")
      .findOne({ AgentName: agentname.AgentName })
      .then((existingAgent) => {
        if (existingAgent) {
          res.status(400).send({ message: "Agent already exists" });
        } else {
          database
            .collection("tblagents")
            .insertOne(agentname)
            .then((document) => {
              console.log("Agent Added", agentname.AgentName);
              res.send(document);
              res.end();
            })
            .catch((error) => {
              console.log(error, "Something is wrong in adding agent");
              res.status(500).send({ message: "Error adding agent" });
            });
        }
      });
  });
});

app.get("/get-agents", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    database
      .collection("tblagents")
      .find({})
      .toArray()
      .then((document) => {
        res.send(document);
        res.end();
      })
      .catch((error) => {
        console.log("Error in fetching agents", error);
      });
  });
});

app.post("/calculate-amount", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    var clientAmount = {
      FirstName: req.body.FirstName.toUpperCase().trim(),
      LastName: req.body.LastName.toUpperCase().trim(),
      Mobile: req.body.Mobile,
      Email: req.body.Email.toLowerCase().trim(),
      AgentName: req.body.AgentName.toUpperCase().trim(),
      LoanAmount: req.body.LoanAmount,
      RateOfInterest: req.body.RateOfInterest,
      challan03: req.body.challan03,
      challan05: req.body.challan05,
      dhc: req.body.dhc,
      IntimationCharges: req.body.IntimationCharges,
      CreatedAt: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    };
    database
      .collection("client-amount")
      .insertOne(clientAmount)
      .then((document) => {
        console.log("Calculated Successful", clientAmount);
        res.send(document);
        res.end();
      })
      .catch((error) => {
        console.log(error, "Error in calculation amouunt");
        res.status(500).send({ message: "Error in calculating" });
      });
  });
});

app.get("/get-clients", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    database
      .collection("client-amount")
      .find({})
      .toArray()
      .then((documents) => {
        console.log(documents);
        res.send(documents);
        res.end();
      });
  });
});

app.get("/get-details/:_id", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    database
      .collection("client-amount")
      .find({ _id: new ObjectId(req.params._id) })
      .toArray()
      .then((documents) => {
        console.log(documents);
        res.send(documents);
        res.end();
      });
  });
});

app.put("/edit-detail/:_id", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    var clientdetails = {
      FirstName: req.body.FirstName.toUpperCase().trim(),
      LastName: req.body.LastName.toUpperCase().trim(),
      Mobile: req.body.Mobile,
      Email: req.body.Email.toLowerCase().trim(),
    };
    database
      .collection("client-amount")
      .updateOne({ _id: new ObjectId(req.params._id) }, { $set: clientdetails })
      .then((document) => {
        if (document.modifiedCount === 0) {
          return res.status(404).send({ message: "Document not found" });
        } else {
          res.send({ message: "Document updated successfully" });
          console.log(`Details updated : `, clientdetails);
        }
        res.end();
      })
      .catch((error) => {
        console.error("Update error : ", error);
        res.status(500).send({ message: "Error updating document" });
      });
  });
});

app.delete("/delete-client/:_id", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("intimation-calculator");
    database
      .collection("client-amount")
      .deleteOne({ _id: new ObjectId(req.params._id) })
      .then((document) => {
        if (document.deletedCount === 1) {
          console.log("Client deleted successfully", document);
          res.status(200).json({ message: "Client deleted successfully" });
        } else {
          res.status(404).json({ message: "Client not found" });
        }
      })
      .catch((error) => {
        console.error("Error in deleting client", error);
      });
  });
});

app.use((req, res, next) => {
  if (req.path === "/admin-login") {
    if (req.cookies.username) {
      return res.clearCookie("username").redirect("/admin-login");
    }
  }
  next();
});

app.get("/", (req, res) => {
  mongoClient.connect(connectionString).then((clientObj) => {
    res.send(`Welcome to home page`);
    res.end();
  });
});

app.get("*", (req, res) => {
  res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f0f2f5;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    text-align: center;
                }

                .container {
                    padding: 2rem;
                    max-width: 600px;
                }

                .error-code {
                    font-size: 8rem;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                    background: linear-gradient(45deg, #3498db, #e74c3c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: float 3s ease-in-out infinite;
                }

                .message {
                    font-size: 1.5rem;
                    color: #7f8c8d;
                    margin: 1rem 0;
                }

                .home-link {
                    display: inline-block;
                    padding: 12px 24px;
                    background: #3498db;
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    margin-top: 1rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .home-link:hover {
                    background: #2980b9;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0,0,0,0.2);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                @media (max-width: 480px) {
                    .error-code {
                        font-size: 5rem;
                    }
                    
                    .message {
                        font-size: 1.2rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error-code">404</h1>
                <p class="message">Oops! The page you're looking for has vanished into the digital void 🌌</p>
                <a href="/" class="home-link">Return to Safety</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(7575);
console.log(`Server Started at : http://127.0.0.1:7575`);
