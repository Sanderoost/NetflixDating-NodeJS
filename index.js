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
const port = process.env.PORT || 3000;
let db = {
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    cluster: process.env.DB_CLUSTER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME
};
const url = `mongodb+srv://${db.username}:${db.password}@${db.cluster}-${db.host}/${db.name}`;
mongo.MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log("Failed to connect", err);
    } else {
        db = client.db(process.env.DB_NAME);
        console.log("Connected")
    }
});  


const homepage = require('./controller/homepage.js');
const about = require('./controller/about.js');
const login = require('./controller/login.js');
const verify = require('./controller/verify.js');
const logout = require('./controller/logout.js');
const add = require('./controller/add.js');
const remove = require('./controller/remove.js');
const push = require('./controller/push.js');
const notfound = require('./controller/notfound.js');

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


function show(req, res){
  let search =  req.body.search;
  let api = "http://www.omdbapi.com/?s=" + search + "&apikey=" + process.env.APIKEY;
  //Make a reqeust to the omdbapi
  axios.get(api)
   .then(function(response) {
    console.log(response.data);
      res.render("add.pug", {
        user:req.session.user,
        search: search,
        data:response.data
      });
    })
  .catch(data => {
    console.log(error.response.data);
  });
}
app.listen(port);

