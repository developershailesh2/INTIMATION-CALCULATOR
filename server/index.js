

var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");

var app = express();
    // cors is required for handling request methods like POST , PUT , Delete 

app.use(cors());
// Required for converting data into JSON
app.use(express.json());
app.use(express.urlencoded({extended : true}));

var connectionString = "mongodb://127.0.0.1:27017";

//API Routes

app.get("/get-admin",(req , res) => {
    mongoClient.connect(connectionString).then((clientObj)=>{
        var database = clientObj.db("intimation-calculator");
        database.collection("tbladmin").find({}).toArray().then((document)=>{
            res.send(document);
            res.end();
        }).catch(err => {
            console.log(err);
        })
    });
});

app.post("/add-agent",(req,res) => {
    mongoClient.connect(connectionString).then((clientObj)=>{
        var database = clientObj.db("intimation-calculator");
        var agentname = {
            AgentName : req.body.AgentName.toUpperCase(),
            CreatedAt : new Date().toLocaleString("en-US",{timeZone : 'Asia/Kolkata'})
        }
        //checking that if agent already exists

        database.collection("tblagents").findOne({AgentName : agentname.AgentName}).then((existingAgent)=>{
            if(existingAgent){
                res.status(400).send({message : "Agent already exists"})
            } else {
                database.collection("tblagents").insertOne(agentname).then((document)=>{
                    console.log("Agent Added",agentname.AgentName);
                    res.send(document);
                    res.end();
                }).catch(error => {
                    console.log(error,"Something is wrong in adding agent");
                    res.status(500).send({ message: "Error adding agent" });
                })
            }
        })
        
        
    })
})

app.get("/get-agents",(req,res)=>{
    mongoClient.connect(connectionString).then((clientObj)=>{
        var database = clientObj.db("intimation-calculator");
        database.collection("tblagents").find({}).toArray().then((document)=>{
            res.send(document);
            res.end();
        }).catch(error => {
            console.log("Error in fetching agents",error);
        })
    })
})





app.get("/",(req , res) => {
    mongoClient.connect(connectionString).then((clientObj) => {
        res.send(`Welcome to home page`);
        res.end();
    })
})



app.get("*",(req , res) => {
    res.status(404).send(`<i>The page you're looking for is not available</i>`);
});


app.listen(7575);
console.log(`Server Started at : http://127.0.0.1:7575`);