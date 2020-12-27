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

    turbine = document.createElement("img");
    turbine.setAttribute("src", "https://thumbs.gfycat.com/PlainSoreEagle-small.gif");
    document.body.append(turbine);

    turbine.style.cssText = `position: fixed; top: ${event.clientY}px; left: ${event.clientX}px; border: 1px solid gray;`;
});

document.addEventListener("click", (event) =>{
    if(event.target != turbine){turbine.remove();}
});