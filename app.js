const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

const userSchema = new mongoose.Schema({
      username : String,
      email : String,
      password : String
});                                             //create schema

const User = mongoose.model("User", userSchema);

const app = express();

app.use(express.static("views"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res) => {
      res.render("home");
});

app.get("/login",(req,res) => {
      res.render("login")
});

app.get("/register",(req,res) => {
      res.render("register");
});

app.post("/",(req,res) => {
      console.log("Up and running...");
});

function submitButton(){
      console.log("Submitted!!!");
}

app.post("/login",(req,res) => {
      const details = {
            userNameOrMail : req.body.username,
            password : req.body.password
      };

      console.log(details);

      //insert object here


      res.redirect("/login");
});

app.post("/register",(req,res) => {
      const credentials = {
            userName : req.body.username,
            mailId : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword
      };
      console.log(credentials);

      const newUser = new User({username:credentials.userName,email:credentials.mailId,password:credentials.password});
      newUser.save();

      res.redirect("/register");
});

app.listen(3000,() => {
      console.log("App running on port 3000...");
});