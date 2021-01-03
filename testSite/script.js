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
                
                console.log(`${table.rows[i].cells[0].textContent} <=> ${table.rows[j].cells[0].textContent}`);
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

    fetch("https://api.thecatapi.com/v1/images/search")
    .then(response => img.setAttribute("src", response.url))
    .catch(error => console.error(error));
}

const telegram = document.getElementById("telegram");
const botUrl = new URL("https://api.telegram.org/bot841759352:AAExQlOJDQH9pvvdA9V7mEbWb_6JtFL2FM4/");
const botMessageUrl = new URL(botUrl + "sendMessage");
const TGresults = document.getElementById("TGresults");
const updateUrl = new URL(botUrl + "getUpdates");
botMessageUrl.searchParams.set("chat_id", "479750895");

telegram.addEventListener("submit", (event) => {
    event.preventDefault();
    botMessageUrl.searchParams.set("text", telegram.message.value);

    fetch(botMessageUrl)
        .then(response => {
            console.log(response);
            sentMessage(response, telegram.message.value);
            telegram.message.value = "";
            return response;
        })
        .catch(error => console.error(error));
});

function sentMessage(response, message) {
    let p = document.createElement("p");
    p.classList.add("sent");

    if(response.ok == true){
        p.innerHTML = message;
    } else{
        p.innerHTML = response.statusText;
    }

    TGresults.append(p);
    TGresults.scrollTop = TGresults.scrollHeight;
}

function receiveMessage(message) {

    if(message.ok == true){
        message.result.forEach(element => {
            let p = document.createElement("p");
            p.classList.add("receive");
            p.innerHTML = element.message.text;

            TGresults.append(p);
            TGresults.scrollTop = TGresults.scrollHeight;
        });
    } else{
        console.log("shit");
    }
}

//result.result[result.result.length - 1].update_id

listenBot();
function listenBot() {
    setInterval(()=>{
      fetch(updateUrl)
        .then(response => response.json())
        .then(result => {
            if(result.result.length >= 1){
                //console.log(result);
            }
            try {
                updateUrl.searchParams.set("offset", result.result[result.result.length - 1].update_id + 1);
            } catch(err) {
                if(err.name != "TypeError") console.error(err);
            }
            receiveMessage(result);
        })
        .catch(error => console.error(error));
    }, 3000);
}