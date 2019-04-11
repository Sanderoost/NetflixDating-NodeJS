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

module.exports = push;