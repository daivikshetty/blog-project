const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/test');

const userSchema = new mongoose.Schema({
      username : String,
      email : String,
      password : String,
      blogs : [{
            title : String,
            content : String
      }]
});                                             //create schema

const User = mongoose.model("User", userSchema);

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "\public")); 

function renderProfilePage(searchUserName){
      console.log("Render Profile " + searchUserName);
      app.get("/profile", (req,res) => {        //can't access /profile unless logged in
            User.find({username : searchUserName}, (err, foundUser4) => {
                  if(err){
                        console.log(err);
                  }
                  else{
                        console.log(foundUser4[0]);
                        res.render("profile",
                        {
                              userName : foundUser4[0].username,
                              mail : foundUser4[0].email,
                              myBlogs : foundUser4[0].blogs
                        });
                  }
            });
      });
}

app.get("/",(req,res) => {
      User.find({}, (err, foundUser) => {
            res.render("home", {objects : foundUser});
      });

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

var tempObj;

app.post("/login",(req,res) => {
      var details = {
            userName : req.body.username,
            userMail : req.body.username,
            password : req.body.password
      };

      console.log(details);

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
                              tempObj = foundUser2[0];
                              if(foundUser2[0].password === details.password){
                                    console.log("Log in was successful!");

                                    // app.get("/profile", (req,res) => {        //can't access /profile unless logged in
                                    //       res.render("profile",{
                                    //             userName : foundUser2[0].username,
                                    //             mail : foundUser2[0].email,
                                    //             myBlogs : foundUser2[0].blogs
                                    //       });
                                    // });

                                    res.redirect("/" + foundUser2[0].username);
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

app.post("/register",(req,res) => {
      var credentials = {
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
                                    console.log("Account created!!");
                                    var newUser = new User({username:credentials.userName,email:credentials.mailId,password:credentials.password});
                                    newUser.save();

                                    var searchName = credentials.userName;
                                    renderProfilePage(searchName);
                                    res.redirect("/" + credentials.userName);
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

app.get('/favicon.ico', (req, res) => res.status(204));                 //prevents browser from trying to render favicon.ico

app.get("/:customProfile", function (req, res) {
      console.log("Custom profile rendered!!!");
      User.find({username : req.params.customProfile}, (err, foundUser6) => {
            if(!err){
                  console.log("Rendered " + req.params.customProfile);
                  res.render("profile", {
                        userName : foundUser6[0].username,
                        mail : foundUser6[0].email,
                        myBlogs : foundUser6[0].blogs
                  });
            }
            else{
                  console.log(err);
            }
      });
});

app.post("/:customProfile", (req, res) => {
      var newBlog = {
            title : req.body.blogTitle,
            content : req.body.blogContent
      }

      var prevBlogs;


      User.find({username : req.params.customProfile}, (err, foundUser5) => {
            if(err){
                  console.log(err);
            }
            else{
                  // console.log("newBlog = ", newBlog);
                  console.log("foundUser5 = ", foundUser5[0]);
                  prevBlogs = foundUser5[0].blogs;
                  console.log("prevBlogs = ", prevBlogs);

                  User.updateOne({username : req.params.customProfile}, {$push : {blogs : newBlog}}, (err, docs) => {
                        if(err){
                              console.log("Error");
                        }
                        else{
                              console.log(docs);
                        }
                  });

                  res.render("profile", {
                        userName : foundUser5[0].username,
                        mail : foundUser5[0].email,
                        myBlogs : foundUser5[0].blogs
                  });
            }
      });

      app.get("/" + req.params.customProfile, function (req, res) {
            console.log("/" + foundUser2[0].username);
            User.find({username : req.params.customProfile}, (err, foundUser6) => {
                  if(err){
                        console.log("Error found");
                  }
                  else{
                        res.render("profile",
                                          {
                                                userName : foundUser6[0].username,
                                                mail : foundUser6[0].email,
                                                myBlogs : foundUser6[0].blogs
                                          }
                        );
                        res.redirect("/" + foundUser6[0].username);
                  }
            });
      });
});

app.listen(3000,() => {
      console.log("App running on port 3000...");
});