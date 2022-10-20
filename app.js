const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mySql = require('mysql');

const app = express();

var con = mySql.createConnection({              // connect to mySQL server
      host : "localhost",
      user : "root",
      password : "@daivik"
});

con.connect((err) => {
      if(!err){
            console.log("Connected!");

            // var CREATE = "CREATE DATABASE testDB";          //creates testDB database
            // con.query(CREATE, (err,result) => {
            //       if(err){
            //             console.log(err);
            //       }
            //       else{
            //             console.log("Created Database");
            //       }
            // });

            var CONTROL = "USE testDB";         //change to testDB
            con.query(CONTROL, (err,result) => {
                  if(err){
                        console.log(err);
                  }
                  else{
                        console.log("Using testDB");
                  }
            })

            // var TABLE = "CREATE TABLE USERS(USERNAME VARCHAR(255), EMAIL VARCHAR(255), PASSWORD VARCHAR(255))";    //create table USERS
            // con.query(TABLE, (err,result) => {
            //       if(err){console.log(err);}
            //       else{
            //             console.log("Created Table");
            //       }
            // });
      }
      else{
            console.log(err);
      }
});

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

      const QUERRY = "SELECT * FROM users;";

      con.query(QUERRY, (err, result) => {
            if(err){
                  console.log(err);
            }
      });
      res.redirect("/login");
});

app.post("/register",(req,res) => {
      const credentials = {
            userName : req.body.username,
            mailId : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword
      };

      if(credentials.password != credentials.confirmPassword){
            console.log("Wrong password!!!");
            res.redirect("/");
      }
      else{
            var INSERT = "INSERT INTO USERS VALUES('" + credentials.userName + "','" + credentials.mailId + "','" + credentials.password +"')";
            // console.log(INSERT);
            // console.log(credentials);
            con.query(INSERT, (err, result) => {
                  if(err){
                        console.log(err);
                  }
                  else{
                        console.log("Inserted one value");
                  }
            });
            res.redirect("/register");
      }
});

app.listen(3000,() => {
      console.log("App running on port 3000...");
});