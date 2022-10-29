const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/test');

const userSchema = new mongoose.Schema({
      username : String,
      email : String,
      password : String
});                                             //create schema

const User = mongoose.model("User", userSchema);

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "\public")); 


app.get("/",(req,res) => {
      res.render("home");
});

app.get("/about", (req, res) => {
      res.render("about")
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

let tempObj;

app.post("/login",(req,res) => {
      const details = {
            userName : req.body.username,
            userMail : req.body.username,
            password : req.body.password
      };

      // console.log(details);

      User.find({$or:
            [     
                  {username : details.userName},
                  {email : details.userMail}
            ]},
            (err,foundUser2) => {
                  if(!err){
                        if(foundUser2.length === 0){
                              console.log("Username or Email doesn't exist");
                        }
                        else{
                              // console.log(foundUser2[0]);
                              if(foundUser2[0].password === details.password){
                                    console.log("Log in was successful!");

                                    app.get("/profile", (req,res) => {        //can't access /profile unless logged in
                                          res.render("profile",{
                                                userName : foundUser2[0].username,
                                                mail : foundUser2[0].email
                                          });
                                    });

                                    res.redirect("/profile");
                              }
                              else{
                                    console.log("Incorrect password!!!");
                                    res.redirect("/login");
                              }
                        }
                  }
            else{
                  console.log(err);
            }
      });

});

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//       console.log("Login successful!!!");
//       res.redirect('/login');
//   });

app.post("/register",(req,res) => {
      const credentials = {
            userName : req.body.username,
            mailId : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword
      };

      if(credentials.password === credentials.confirmPassword){
            User.find({$or:
                  [
                        {username : credentials.userName},
                        {email : credentials.mailId}
                  ]},
                  (err,foundUser2) => {
                        if(!err){
                              if(foundUser2.length!=0){
                                    console.log("Account already exists!!!");
                                    res.redirect("/register");
                              }
                              else{
                                    console.log("Saving...");
                                    const newUser = new User({username:credentials.userName,email:credentials.mailId,password:credentials.password});
                                    newUser.save();
                                    res.redirect("/register");
                              }
                        }
                        else{
                              console.log(err);
                        }
            });
      }
      else{
            console.log("Enter passwords again!!!");
            res.redirect("/register");
      }
});

// app.get("/:userPage", function(req, res){
//       const userPage = req.params.userPage;
//       console.log(userPage);
// });

app.listen(3000,() => {
      console.log("App running on port 3000...");
});