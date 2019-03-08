const express = require('express');
const app = express();
const port = 3000;

app
    .set('view engine', 'pug')
    .use('/static', express.static('static'))
    .get('/', homepage)
    .get('/about', about)
    .get('*', error404);

function homepage(req, res){
  res.render("homepage.pug");
}
function about(req, res){
  res.render("about.pug");
}
function error404(req, res){
  res.status(404).send('404: De pagina is helaas niet gevonden');
}

app.listen(port, () => console.log(`Server is gestart op port: ${port}!`))