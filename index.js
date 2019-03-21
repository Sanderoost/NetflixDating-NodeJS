const express = require('express');
const axios = require('axios');
var slug = require('slug');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

const app = express();
const port = 3000;

require('dotenv').config()

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
console.log(url);
mongo.MongoClient.connect(url, function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

app
    .use('/static', express.static('static'))
    .use(bodyParser.urlencoded({extended: true}))
    .set('view engine', 'pug')
    .delete('/:id', remove)
    .get('/', homepage)
    .post('/', push)
    .get('/about', about)
    .get('*', notfound);

var data = [
    {
      id: 'how-i-met-your-mother',
      img: 'static/how-i-met-your-mother.jpg',
      title: 'How i met your mother',
      rating: '9'
    },
    {
      id: 'lost',
      img: 'static/lost.jpg',
      title: 'Lost',
      rating: '8,4'
    }
  ]

// Pathing url
function homepage(req, res){
  res.render("homepage.pug", {data: data});
}
function about(req, res){
  res.render("about.pug");
}
function notfound(req, res){
  res.status(404).render("notfound.pug");
}


// Push data into array
function push(req, res){
  var id = slug(req.body.film).toLowerCase()
  const api = "http://www.omdbapi.com/?t=" + id + "&apikey=" + process.env.APIKEY;
  //Make a reqeust to the omdbapi
  axios.get(api)
   .then(response=> { 
        data.push({
        id: id,
        img: response.data.Poster,
        title: req.body.film,
        rating: response.data.imdbRating
      })
      //after the data has been added redirect to the home page 
    res.redirect('/')
    })
  .catch(data=>console.log(error.response.data))
}


function remove(req, res) {
  var id = req.params.id
  data = data.filter(function (value) {
    return value.id !== id
  })

  res.json({status: 'ok'})
}


app.listen(port)