function showNotification({className, html = "Attention!", showtime, style = "", onclk = function () {this.remove();}, }){
    let notification = document.createElement("p");
    notification.classList.add("notification");

    if(className){
        notification.classList.add(className);
    }

    notification.style.cssText = style;
    notification.innerHTML = html;

    notification.onclick = onclk.bind(notification);

    let x = document.createElement("span");
    x.classList.add("close");
    x.innerHTML = "X"; //&#9747;
    x.onclick = function() {
        this.parentElement.remove();
    }
    notification.appendChild(x);

    document.body.append(notification);

    if(showtime){
        setTimeout(() => {notification.remove()}, showtime);
    }
}




showNotification({
    html: "Hello!", 
    className: "welcome", 
    style: "top: 30px; right: 30px;",
    showtime: 3000,
    onclk: function() {
        this.textContent = "fuck";
    },
  });

//showNotification({});