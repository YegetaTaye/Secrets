require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login")
});
console.log(md5(4321));
app.post("/register", (req, res) => {
  User.findOne({email: req.body.username})
    .then((foundUser) => {
      if(foundUser){
        res.send("The username is not available.");
      }else{
        const newUser = new User ({
          email: req.body.username,
          password: md5(req.body.password)});
        newUser.save();
        res.render("secrets");
      }
    })
    .catch((err) => { console.log(err)})
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({email: req.body.username})
    .then((foundUser) => {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.send("Incorrect password.");
        }
      }else{
        res.send("User not found.");
      }
    })
})


app.listen(3000, () => {
  console.log("Server started running on port 3000.");
});
