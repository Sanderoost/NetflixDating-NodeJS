var remove = document.getElementById('js-remove');
var enable = document.getElementById('enable');
var form = document.getElementsByTagName("form")[0];

if (remove) {
  remove.addEventListener('click', onremove)
}
if (enable) {
  enable.addEventListener('click', enableform)
}
function enableform(){
	console.log(form);
}

function onremove(ev) {
  var node = ev.target
  var id = node.dataset.id


  var res = new XMLHttpRequest()

  res.open('DELETE', '/' + id)
  res.onload = onload
  res.send()

  function onload() {
    if (res.status !== 200) {
      throw new Error('Could not delete!')
    }


    window.location = '/'
  }
}