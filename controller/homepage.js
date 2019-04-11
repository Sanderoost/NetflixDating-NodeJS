// Database packages
const express = require("express");
const mongo = require("mongodb");
const axios = require("axios");
const session = require("express-session");

const dotenv = require("dotenv").config();
// Database variables
const app = express();
const port = 3000;
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

module.exports = homepage;