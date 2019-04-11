// Database packages
const express = require("express");
const mongo = require("mongodb");
const axios = require("axios");
const session = require("express-session");
require("dotenv").config();
// Database variables
const app = express();
const port = process.env.PORT || 3000;

let db = {
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    cluster: process.env.DB_CLUSTER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME
};
const url = `mongodb+srv://${db.username}:${db.password}@${db.cluster}-${db.host}/${db.name}?retryWrites=true`;

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log("Failed to connect", err);
    } else {
        db = client.db(process.env.DB_NAME);
    }
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
          res.redirect("/login", {
            fault : "Email or password is wrong"
          })
      }
  });
}
module.exports = verify;