//jqeury for the sortable function
$( function() {
  $( "#sortable" ).sortable();
  $( "#sortable" ).disableSelection();
} );


var enable = document.getElementById('enable');
var form = document.getElementsByTagName("form")[0];

// creates button function for every id
const buttons = document.querySelectorAll('ul button')
buttons.forEach(function(currentBtn){
  currentBtn.addEventListener('click', onremove)
})

if (enable) {
  enable.addEventListener('click', enableform)
}

// Hide add button if the screen has 5 li
if (document.getElementsByTagName("section li").length > 4) {
  enable.classList.add("hide");
}

function enableform(){
	form.classList="show";
  enable.classList.add("hide");
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