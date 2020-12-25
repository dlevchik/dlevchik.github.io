let button = document.getElementById("login");
let form = document.getElementById("loginform");
let close = document.getElementById("close");
let scrollUp = document.getElementById("scrollUp");
let loadingScreen = document.getElementById("loadingScreen");

form.hidden = true;
scrollUp.style.display = "none";
//scrollUp.hidden = true; //not working

button.onclick = function() {
    form.hidden = false;
  };

close.onclick = function(){
    form.hidden = true;
}

scrollUp.onclick = function(){
  window.scrollTo(0,0);
}

window.onscroll = function(){
  if(window.pageYOffset < document.documentElement.clientHeight){
    scrollUp.style.display = "none";
    //scrollUp.hidden = true;
  } else{
    scrollUp.style.display = "inline-block";
    //scrollUp.hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", function() {
    loadingScreen.remove();
    document.body.style.overflow = "inherit";
});