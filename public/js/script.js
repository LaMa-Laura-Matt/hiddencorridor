// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("hiddencorridor JS imported successfully!");
});

function addInput(){
  var newdiv = document.createElement('div');
  //newdiv.id = dynamicInput[counter];
  newdiv.innerHTML = "<br><input type='text' name='ingredients'> <input type='button' class='btn' value='-' style='background-color: red;' onClick='removeInput(this);'>";
  document.getElementById('formulario').appendChild(newdiv);
}
function addInputInUpdatePotion(){
   var newdiv = document.createElement('li');
  //newdiv.id = dynamicInput[counter];
  newdiv.innerHTML = "<br><input type='text' name='ingredients'> <input type='button' class='btn' value='-' onClick='removeInput(this);'>";
  document.getElementById('updateIngredients').appendChild(newdiv);
}

function removeInput(btn){
    btn.parentNode.remove();
}

const check = function() {
if (document.getElementById('password').value ==
document.getElementById('confirmPassword').value) {
document.getElementById('message').style.color = 'green';
document.getElementById('message').innerHTML = 'matching';
} else {
document.getElementById('message').style.color = 'red';
document.getElementById('message').innerHTML = 'not matching';
}
}

function likeOrDislike() {
let likes = document.getElementById("likeCounter").innerHTML;
let numberLikes = (+likes);
numberLikes += 1;
document.getElementById("likeCounter").innerHTML = numberLikes;
}