

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

// app.get("get-customer",(req , res) => {
//     mongoClient.connect(connectionString).then((clientObj)=>{
//         var database = clientObj.db("intimation-calculator");
//         database.collection("tblcustomer").find({}).toArray().then((document)=>{
//             res.send(document);
//             res.end();
//         })
//     })
// })

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