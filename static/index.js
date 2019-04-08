var body = document.querySelector("body");
    body.classList.remove("no-js");
// creates button function for every id
const remove = document.querySelectorAll('ul button');
remove.forEach(function(currentBtn){
  currentBtn.addEventListener('click', onremove);
});

function onremove(ev) {
  var node = ev.target;
  var id = node.dataset.id;
  var res = new XMLHttpRequest();
  res.open('DELETE', '/' + id);
  res.onload = onload;
  res.send();
  function onload() {
    if (res.status !== 200) {
      throw new Error('Could not delete!');
    }
    window.location = '/';  
  }
}
