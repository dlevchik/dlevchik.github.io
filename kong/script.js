// function printNumbers(from, to){
//     i = from;
//     intr = setInterval(() => {
//         console.log(i++);
//         if (i >= to) {
//             clearInterval(intr);
//         }
//     }, 1000);
// }

function printNumbers(from, to){
    i = from;
    setTimeout(function func() {
        console.log(i++);
        if(i < to) {
            setTimeout(func, 1000);
        }
    }, 1000)
}

printNumbers(4, 10);