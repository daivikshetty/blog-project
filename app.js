const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const otp = require('./otp.js');
const config = require('./config')


mongoose.connect('mongodb+srv://daivik_shetty:' + config.mongoPassword + '@cluster001.1hocejh.mongodb.net/blogsDB');

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
app.use(express.static(__dirname + "/public")); 

app.get("/",(req,res) => {
      console.log(config.mongoPassword);
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
                              tempObj = foundUser2[0];
                              if(foundUser2[0].password === details.password){
                                    console.log("Log in was successful!");

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

app.get("/otp",(req, res) => {
      res.render("otp");
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
                                    otp.getOtp(credentials.mailId);
                                    res.redirect("/otp");
                                    app.post("/otp", (req, res) => {
                                          console.log(otp.num.toString(),req.body.userotp);
                                          if(req.body.userotp === otp.num.toString()){
                                                console.log("Account created!!");
                                                var newUser = new User({username:credentials.userName,email:credentials.mailId,password:credentials.password});
                                                newUser.save();

                                                var searchName = credentials.userName;
                                                res.redirect("/" + credentials.userName);
                                          }
                                          else{
                                                res.redirect("/register");
                                          }
                                    });
                                    
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
app.get('/index.js', (req, res) => res.status(204));

app.get("/:customProfile", function (req, res) {
      User.find({username : req.params.customProfile}, (err, foundUser6) => {
            if(!err){
                  if(foundUser6.length !== 0){
                        console.log("Rendered " + req.params.customProfile);
                        console.log(foundUser6[0]);
                        res.render("profile", {
                              userName : foundUser6[0].username,
                              mail : foundUser6[0].email,
                              myBlogs : foundUser6[0].blogs
                        });
                  }
                  else{
                        res.render("notfound");
                  }
                  
            }
            else{
                  console.log(err);
            }
      });
});

app.get("/:customProfile/edit", (req, res) => {
      User.find({username : req.params.customProfile}, (err, foundUser6) => {
            if(!err){
                  if(foundUser6.length !== 0){
                        console.log("Rendered Edit Page for " + req.params.customProfile);
                        console.log(foundUser6[0]);
                        res.render("edit", {
                              userName : foundUser6[0].username,
                              mail : foundUser6[0].email,
                              myBlogs : foundUser6[0].blogs
                        });
                  }
                  else{
                        res.redirect("/" + req.params.customProfile);
                  }
                  
            }
            else{
                  console.log(err);
            }
      });
});

app.get("/:customProfile/:somethingRandom", (req, res) => {
      res.render("notfound");
});

app.post("/:customProfile/edit", (req, res) => {
      var newBlog = {
            title : req.body.blogTitle,
            content : req.body.blogContent
      }

      User.updateOne({username : req.params.customProfile}, {$push : {blogs : newBlog}}, (err, docs) => {
                              if(err){
                                    console.log("Error");
                              }
                              else{
                                    newBlog = null;
                                    console.log("newBlog = ",newBlog);
                                    console.log(docs);
                                    return res.redirect("/" + req.params.customProfile);
                              }
      });

      User.find({username : req.params.customProfile}, (err, foundUser5) => {
            if(err){
                  console.log(err);
            }
            else{
                  console.log(foundUser5[0].username);
                  res.render("profile", {
                        userName : foundUser5[0].username,
                        mail : foundUser5[0].email,
                        myBlogs : foundUser5[0].blogs
                  });
            }
      });

      // app.get("/" + req.params.customProfile, function (req, res) {
      //       console.log("/" + foundUser2[0].username);
      //       User.find({username : req.params.customProfile}, (err, foundUser6) => {
      //             if(err){
      //                   console.log("Error found");
      //             }
      //             else{
      //                   res.render("profile",
      //                                     {
      //                                           userName : foundUser6[0].username,
      //                                           mail : foundUser6[0].email,
      //                                           myBlogs : foundUser6[0].blogs
      //                                     }
      //                   );
      //                   res.redirect("/" + foundUser6[0].username);
      //             }
      //       });
      // });
});

app.listen(3000,() => {
      console.log("App running on port 3000...");
});