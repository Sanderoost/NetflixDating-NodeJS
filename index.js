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

const homepage = require('./controller/homepage.js');
const about = require('./controller/about.js');
const login = require('./controller/login.js');
const verify = require('./controller/verify.js');
const logout = require('./controller/logout.js');
const add = require('./controller/add.js');

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
    .get("/add", add)
    .get("/:id", push)
    .post("/add", show)
    .post("/login", verify)
    .get("*", notfound);

function notfound(req, res){
  res.status(404).render("notfound.pug");
}



// Push data into array
function push(req, res){
  let id = req.params.id;
  let api = "http://www.omdbapi.com/?i=" + id + "&apikey=" + process.env.APIKEY;
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

// Push data into array
function show(req, res){
  let id =  req.body.search;
  let api = "http://www.omdbapi.com/?s=" + id + "&apikey=" + process.env.APIKEY;
  //Make a reqeust to the omdbapi
  axios.get(api)
   .then(function(response) {
      res.render("add.pug", {
        user:req.session.user,
        data:response.data
      });
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
