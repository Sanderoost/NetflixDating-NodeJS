var body = document.querySelector("body");
    body.classList.remove("no-js");
const searchresult = document.getElementById('list'),
      input = document.querySelector('#film');
let   search = "los",
      html = '',
      request = new XMLHttpRequest();
      add = "";
input.addEventListener('input', getInput) // register for oninput
function getData () {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
    renderHTML(data);
  } else {
   console.log("Something is not right");
  }
}
function getInput(e) {
  html = "";
  while (searchresult.firstChild) {
      searchresult.removeChild(searchresult.firstChild);
  }
  if (e.target.value.length > 2) {
      search = e.target.value;
      request.open('GET', 'http://www.omdbapi.com/?apikey=e1225bf&page=1&s=' + search, true)
      request.send();
      request.onerror = function(error) {
        searchresult.insertAdjacentHTML('beforeend', error);
      };
    request.addEventListener('load', getData);
  }
}

function renderHTML (data) { 
  data.Search.forEach(function (item) { 
  html += `<li>
              <p>${item.Title}</p>
              <img data-id=${item.imdbID} src=${item.Poster}></img>              
            </li>`;
  });
  searchresult.insertAdjacentHTML('beforeend', html);

  add = document.querySelectorAll('#list li');
  add.forEach(function(currentBtn){
    currentBtn.addEventListener('click', onadd);
  });
}

function onadd(ev) {
  var node = ev.target;
  var id = node.dataset.id;
  var res = new XMLHttpRequest();
  res.open('GET', '/' + id);
  res.onload = onload;
  res.send();
  function onload() {
    if (res.status !== 200) {
      throw new Error('Could not delete!');
    }
    window.location = '/';  
  }
}
