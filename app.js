//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
var md5 = require('md5');

const port = 3000;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

const username = "nimitsajal";
const password = "e4QBYlp2tCodDUqX";
const cluster = "Cluster0";
const dbname = "secretsDB";

mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.deogx.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;
db.on("error", function(){
  console.log("Error connecting to DB!");
});
db.once("open", function(){
  console.log("Successfully connected to DB");
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    const email = req.body.username;
    const password = md5(req.body.password);
    const newUser = new User({
        email: email,
        password: password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
            res.render(err);
        }
        else{
            console.log(email + " Registered Successfully");
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const email = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: email}, function(err, results){
        if(err){
            console.log(err);
            res.send(err);
        }
        else if(results){
            console.log("Username Valid")
            if(results.password === password){
                console.log("Logging in...");
                res.render("secrets");
            }
            else{
                console.log("Invalid Password!");
                res.redirect("/login");
            }
        }
        else{
            console.log("Username Invalid");
            res.redirect("/login");
        }
    });
});




app.listen(port, function(req, res){
    console.log("Server started successfully at " + port);
});