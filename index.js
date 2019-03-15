const express = require('express');
const app = express();
const port = 3000;
var slug = require('slug');
var bodyParser = require('body-parser');

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
      title: 'How i met your mother'
    },
    {
      id: 'lost',
      title: 'Lost'
    }
  ]

function homepage(req, res){
  res.render("homepage.pug", {data: data});
}

function push(req, res){
  var id = slug(req.body.film).toLowerCase()

  data.push({
    id: id,
    title: req.body.film,
  })

  res.redirect('/')
}

function remove(req, res) {
  var id = req.params.id

  data = data.filter(function (value) {
    return value.id !== id
  })

  res.json({status: 'ok'})
}

function about(req, res){
  res.render("about.pug");
}
function notfound(req, res){
  res.status(404).render("notfound.pug");
}

app.listen(port, () => console.log(`Server is gestart op port: ${port}!`))