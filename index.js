// Database packages
const express = require("express");
var mongo = require("mongodb");
const axios = require("axios");
var session = require("express-session");

// Other packages
const dotenv = require("dotenv").config();
var slug = require("slug");
var bodyParser = require("body-parser");

// Database variables
const app = express();
const port = 3000;
var db = null;
var url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;

// Connect to the database
mongo.MongoClient.connect(url, function (err, client) {
	db = client.db(process.env.DB_NAME);
  useNewUrlParser: true;
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
    .get("/login", login)
    .get("/logout", logout)
    .post("/login", verify)
    .post("/", push)
    .get("/about", about)
    .get("*", notfound);

function homepage(req, res, next) {
	db.collection("user").find().toArray(done);
	function done(err, data) {
		if (err) {
			next(err);
		} else {
			res.render("homepage.pug", {
	        data: data,
	        user: req.session.user
	      });
	    }
	  }
}

function login(req, res){
  res.render("login.pug");
}

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    } 
    else {
      res.redirect("/");
    }
  });
}

function about(req, res){
  res.render("about.pug");
}
function notfound(req, res){
  res.status(404).render("notfound.pug");
}

// Login verify
function verify(req, res){
  var email = req.body.user;
  var password = req.body.password;
  console.log(email);
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
  var id = slug(req.body.film).toLowerCase();
  var api = "http://www.omdbapi.com/?t=" + id + "&apikey=" + process.env.APIKEY;
  //Make a reqeust to the omdbapi
  axios.get(api)
   .then(response=> { 
     db.collection("user").insertOne({
        email: req.session.user,
        movieid: req.body.film,
        title: response.data.Title,
        rank: 3,
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
  .catch(data=>console.log(error.response.data));
}


function remove(req, res) {
  var id = req.params.id;
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