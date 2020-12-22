let test = document.getElementById("test");

let clock = document.createElement("p");
let hours = document.createElement("span");
let minutes = document.createElement("span");
let seconds = document.createElement("span");

minutes.style.color = "red";
hours.style.color = "green";
seconds.style.color = "blue";

clock.append(hours, ":", minutes, ":", seconds);
document.body.append(clock);

updateClock();
setInterval(updateClock, 1000);

function updateClock(){
    let date = new Date();

    minutes.textContent = date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();
    hours.textContent = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    seconds.textContent = date.getSeconds() <= 9 ? "0" + date.getSeconds() : date.getSeconds();
}