let button = document.getElementById("login");
let form = document.getElementById("loginform");
let close = document.getElementById("close");
let scrollUp = document.getElementById("scrollUp");
let loadingScreen = document.getElementById("loadingScreen");

form.style.display = "none";
scrollUp.style.display = "none";
//scrollUp.hidden = true; //not working

button.onclick = function() {
  form.style.display = "flex";
};

close.onclick = function(){
  form.style.display = "none";
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

//document.addEventListener("load", function() {
    loadingScreen.remove();
    document.body.style.overflow = "inherit";
// });

form.addEventListener("click", (event) => {
  if(event.target.classList.contains("loginform")) form.style.display = "none";
});