// Database packages
const express = require("express");
const mongo = require("mongodb");
const axios = require("axios");
const session = require("express-session");

// Other packages
const dotenv = require("dotenv").config();
const slug = require("slug");
const bodyParser = require("body-parser");

// Database variables
const app = express();
const port = 3000;
let db = null;
let url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;

// Connect to the database
mongo.MongoClient.connect(url, {useNewUrlParser: true }, function (err, client) {
	db = client.db(process.env.DB_NAME);
});

app
    .use("/static", express.static("static"))
    .use(bodyParser.urlencoded({extended: true}))
    .use(session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET
    }))
    .set("view engine", "pug")
    .delete("/:id", remove)
    .get("/", homepage)
    .get("/about", about)
    .get("/login", login)
    .get("/logout", logout)
    .post("/login", verify)
    .post("/", push)
    .get("*", notfound);

function homepage(req, res) {
  // Get data from the user database
	db.collection("user").find().toArray(done);
	function done(err, data) {
		if (err) {
			console.log(err);
		} else {
			res.render("homepage.pug", {
	        data: data,
	        user: req.session.user
	      });
	    }
	  }
}

function about(req, res){
  res.render("about.pug", {
    user:req.session.user
  });
}

function login(req, res){
  res.render("login.pug");
}

function logout(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } 
    else {
      res.redirect("/");
    }
  });
}

function notfound(req, res){
  res.status(404).render("notfound.pug");
}

// Login verify
function verify(req, res){
  let email = req.body.user;
  let password = req.body.password;
  db.collection("login").findOne({}, function(err, result) {
    if (err) throw err;
      if (result.email == email && result.password == password) {
        req.session.user = email;
        res.redirect("/");
      }
  });
}

// Push data into array
function push(req, res){
  let id = slug(req.body.film).toLowerCase();
  let api = "http://www.omdbapi.com/?t=" + id + "&apikey=" + process.env.APIKEY;
  //Make a reqeust to the omdbapi
  axios.get(api)
   .then(function(response) { 
     db.collection("user").insertOne({
        email: req.session.user,
        movieid: req.body.film,
        title: response.data.Title,
        poster: response.data.Poster
      }, done);
      function done(err, data) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      }
    })
  .catch(data => {
    console.log(error.response.data);
  });
}


function remove(req, res) {
  let id = req.params.id;
  db.collection("user").deleteOne({
    _id: mongo.ObjectID(id)
  }, done);

  function done(err) {
    if (err) {
      next(err);
    } else {
      res.json({status: "ok"});
    }
  }
}

app.listen(port);
