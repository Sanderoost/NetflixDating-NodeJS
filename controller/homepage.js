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