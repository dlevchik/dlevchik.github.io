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