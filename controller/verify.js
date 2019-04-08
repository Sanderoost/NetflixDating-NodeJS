// Database packages
const express = require("express");
const mongo = require("mongodb");
const axios = require("axios");
const session = require("express-session");

// Database variables
const app = express();
const port = 3000;
let db = null;
let url = "mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT;

// Connect to the database
mongo.MongoClient.connect(url, {useNewUrlParser: true }, function (err, client) {
	db = client.db(process.env.DB_NAME);
});

// Login verify
function verify(req, res){
  let email = req.body.user;
  let password = req.body.password;
  db.collection("login").findOne({}, function(err, result) {
    if (err){ 
      throw err;
    }
      if (result.email == email && result.password == password) {
        req.session.user = email;
        res.redirect("/");
      }
      else{
          res.redirect("/", {
            fault : "Email or password is wrong"
          })
      }
  });
}
module.exports = verify;