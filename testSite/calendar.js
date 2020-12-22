function createCalendar(elem, year, month) {
    let dtday = 1;
    let date = new Date(year, month - 1, dtday);
    let cells = 1;
    let dayOfWeek = date.getDay();
    
    let table = document.createElement("table");
    table.insertAdjacentHTML("afterbegin", "<tr><th>ПН</th><th>ВТ</th><th>СР</th><th>ЧТ</th><th>ПТ</th><th>СБ</th><th>ВС</th></tr>");
    
    let tr = document.createElement("tr");

    while((date.getMonth()) == month - 1){

        if(dtday == 1 && dayOfWeek != 1){
            if(dayOfWeek == 0){dayOfWeek = 7}
            
            for(i = 1; i < dayOfWeek; i++, cells++){
                let td = document.createElement("td");
                tr.append(td);
            }
        }

        let td = document.createElement("td");
        td.textContent = dtday;
        tr.append(td);
        
        let endOfMonth = (new Date(year, month - 1, dtday + 1).getMonth() != month - 1);

        if(cells % 7 == 0 || endOfMonth){
            if(endOfMonth){
                let i = 0;
                while((cells + i) % 7 != 0){
                    let td = document.createElement("td");
                    tr.append(td);
                    i++;
                }
            }

            table.append(tr);
            tr = document.createElement("tr");
        }

        cells++;
        date.setDate(++dtday);
    }
    elem.append(table);
    return table;
  }

  for(let i = 1; i < 13; i++){
      createCalendar(document.body, 2020, i).insertAdjacentHTML('afterbegin', `${i}`);;
  }
  //let div = document.createElement("div"); document.body.append(div); createCalendar(div, 2020, 11);