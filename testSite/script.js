let table = document.getElementById("table");

for (let i = 0; i < table.rows.length-1; i++)
    {
        for (let j = i + 1; j < table.rows.length; j++)
        {
            if (table.rows[i].cells[0].textContent.localeCompare(table.rows[j].cells[0].textContent) > 0)
            {
                let temporary = table.rows[i].cells[0].innerHTML;
                table.rows[i].cells[0].innerHTML = table.rows[j].cells[0].innerHTML;
                table.rows[j].cells[0].innerHTML = temporary;
                
                //console.log(`${table.rows[i].cells[0].textContent} <=> ${table.rows[j].cells[0].textContent}`);
            }  
        }
    }


let turbine;

document.addEventListener("contextmenu", (event) =>{
    event.preventDefault();
    if(event.target == turbine)return;
    if(turbine) turbine.remove();

    turbine = document.createElement("img");
    turbine.setAttribute("src", "https://thumbs.gfycat.com/PlainSoreEagle-small.gif");
    document.body.append(turbine);

    let turbineSound = new Audio("09038.mp3");
    turbineSound.play(); //Please don't ask

    turbine.style.cssText = `position: fixed; top: ${event.clientY}px; left: ${event.clientX}px; border: 1px solid gray; height: 100px;`;
});

document.addEventListener("click", (event) =>{
    if(turbine && event.target != turbine)turbine.remove();
});


let git = document.getElementById("git");
let gitResult = document.getElementById("gitResult");

function updateGithub() {
    gitResult.textContent = `${git.value}'s information: loading...`;

    fetch(`https://api.github.com/users/${git.value}`)
        .then(response => {
            if(response.ok == false){
                throw new Error(`${response.status}:${response.statusText}`);
            } else{
                return response.json()
            }
        })
        .then(result => {
            let creationDate = new Date(result.created_at);
            let commitDate = new Date(result.updated_at);

            gitResult.innerHTML = `<a href="${result.html_url}" target="_blank">${result.login}</a><img src="${result.avatar_url}"><span>id: ${result.id}</span><span>repositories: ${result.public_repos}</span><span>account created: ${creationDate.getDate() + "." + (creationDate.getMonth() + 1) + "." + creationDate.getFullYear()}</span><span>last commit: ${commitDate.getDate() + "." + (commitDate.getMonth() + 1) + "." + commitDate.getFullYear()}</span>`;
        })
        .catch(error => gitResult.textContent = error);
}

updateGithub();
git.addEventListener("input", updateGithub);

function getRandomCat() {
    let img = document.getElementById("randomCat");

    fetch("https://api.thecatapi.com/v1/images/search", {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
      })
    .then(response => response.json())
    .then(result => img.setAttribute("src", result[0].url))
    .catch(error => console.error(error));
}//img.setAttribute("src", response[0].url)

const telegram = document.getElementById("telegram");
const botUrl = new URL("https://api.telegram.org/bot841759352:AAHAVQGkvfyYym9twOtID4CxalccbJgRIrE/");
const botMessageUrl = new URL(botUrl + "sendMessage");
botMessageUrl.searchParams.set("chat_id", "479750895");
const TGresults = document.getElementById("TGresults");
const updateUrl = new URL(botUrl + "getUpdates");
const messageSound = new Audio("what-302.mp3");
const temporaryMessage = document.querySelector(".temporaryMessage");
const telegramCheckbox = document.getElementById("sound");
let firstSessionMessage = false;
let pressed = new Set();

let messageArray = JSON.parse(localStorage.getItem("messageArray"));
if (!messageArray){
    localStorage.setItem("messageArray", JSON.stringify([]));
    messageArray = JSON.parse(localStorage.getItem("messageArray"));
}

if(!localStorage.getItem("checkbox")){
    localStorage.setItem("checkbox", true);
}
telegramCheckbox.checked = JSON.parse(localStorage.getItem("checkbox"));

telegramCheckbox.addEventListener("click", () => {
    localStorage.setItem("checkbox", telegramCheckbox.checked);
});

//(messageArray.length - 10) ||
for (let i = 0; i < messageArray.length; i++) {
    if(!messageArray[i]) {break;}
    let messageArrayElem = JSON.parse(messageArray[i]);
    
    if(Array.isArray(messageArrayElem.result)){
        receiveMessage(messageArrayElem);
    } else{
        sentMessage(messageArrayElem.response, messageArrayElem.message, messageArrayElem.date);
    }
}

firstSessionMessage = true;

telegram.message.value = localStorage.getItem("messageValue");

telegram.message.addEventListener("input", () => {
    localStorage.setItem("messageValue", telegram.message.value); 
});

telegram.addEventListener("submit", (event) => {
    event.preventDefault();
    if(!telegram.message.value){
        telegram.message.value = "";
        return;
    }
    botMessageUrl.searchParams.set("text", telegram.message.value);

    fetch(botMessageUrl)
        .then(response => {
            sentMessage(response, telegram.message.value, Date.now());
            telegram.message.value = "";
            localStorage.setItem("messageValue", "");
            
            return response;
        })
        .catch(error => console.error(error));
});

telegram.message.addEventListener("keydown", (event) =>{
    pressed.add(event.code);

    if((pressed.has("ShiftLeft") || pressed.has("ShiftRight")) && pressed.has("Enter")){
        event.preventDefault();
        telegram.message.value += "\n";
    } else if(!(pressed.has("ShiftLeft") || pressed.has("ShiftRight")) && pressed.has("Enter")){
        telegram.button.click();
    }

    telegram.message.addEventListener("keyup", (event) => {
        pressed.delete(event.code);
      });
});

function sentMessage(response, message, date) {
    let p = document.createElement("p");
    p.classList.add("sent");

    if(firstSessionMessage && messageArray.length != 0){
        TGresults.append(document.createElement("hr"));
        firstSessionMessage = false;
    }

    if(response.ok == true){
        p.textContent = message;

        let messageDate = new Date(date);
        let messageHours = messageDate.getHours() <= 9 ? "0" + messageDate.getHours() : messageDate.getHours();
        let messageMins = messageDate.getMinutes() <= 9 ? "0" + messageDate.getMinutes() : messageDate.getMinutes();
        let messageSeconds = messageDate.getSeconds() <= 9 ? "0" + messageDate.getSeconds() : messageDate.getSeconds();

        p.insertAdjacentHTML("beforeend", `<time>${messageHours}:${messageMins}:${messageSeconds}</time>`);

        if(response.type){
            messageArray.push(JSON.stringify({response: {ok: response.ok, status: response.status, statusText: response.statusText}, message: message, date: date}));
        }

        localStorage.setItem("messageArray", JSON.stringify(messageArray));
    } else{
        p.textContent = response.statusText;
    }

    if(temporaryMessage){
        temporaryMessage.remove();
    }

    TGresults.append(p);
    TGresults.scrollTop = TGresults.scrollHeight;
}

function receiveMessage(message) {

    if(message.ok == true){

        message.result.forEach((element, index) => {
            let p = document.createElement("p");
            p.classList.add("receive");
            p.textContent = element.message.text;

            if(firstSessionMessage && messageArray.length != 0){
                TGresults.append(document.createElement("hr"));
                firstSessionMessage = false;
            }

            if(message.played == undefined){
                if(index == 0){
                    messageArray.push(JSON.stringify({ok: message.ok, result: message.result, played: true}));
                    localStorage.setItem("messageArray", JSON.stringify(messageArray));
                }
                
                if(JSON.parse(localStorage.getItem("checkbox"))){
                    messageSound.play().catch(error => {if(error.name != "NotAllowedError"){
                        console.error(error);
                    }});
                }
            }

            if(temporaryMessage){
                temporaryMessage.remove();
            }

            let messageDate = new Date(element.message.date * 1000);
            let messageHours = messageDate.getHours() <= 9 ? "0" + messageDate.getHours() : messageDate.getHours();
            let messageMins = messageDate.getMinutes() <= 9 ? "0" + messageDate.getMinutes() : messageDate.getMinutes();
            let messageSeconds = messageDate.getSeconds() <= 9 ? "0" + messageDate.getSeconds() : messageDate.getSeconds();

            p.insertAdjacentHTML("beforeend", `<time>${messageHours}:${messageMins}:${messageSeconds}</time>`);

            TGresults.append(p);
            TGresults.scrollTop = TGresults.scrollHeight;
        });
    } else{
        console.error(message.statusText);
    }
}

listenBot();
let fetchInProgress = false;
function listenBot() {
    setInterval(()=>{
        if(fetchInProgress == false){
            fetchInProgress = true;
            fetch(updateUrl)
                .then(response => response.json())
                .then(result => {
                    try {
                        updateUrl.searchParams.set("offset", result.result[result.result.length - 1].update_id + 1);
                    } catch(err) {
                        if(err.name != "TypeError") console.error(err);
                    }
                    receiveMessage(result);

                    fetchInProgress = false;
                })
                .catch(error => {console.error(error); fetchInProgress = false;});
        }
    }, 3000);
}
