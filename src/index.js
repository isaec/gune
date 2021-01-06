import * as rot from "rot-js"



const display = new rot.Display({
    width: 60, 
    height: 35,
    fontSize:25,
    fontFamily:"metrickal, monospace",
    forceSquareRatio:true,
    })

const gameFigure = document.createElement("FIGURE")
document.body.appendChild(gameFigure)
gameFigure.id = "gameFigure"
console.log(gameFigure.fontFamily)
gameFigure.appendChild(display.getContainer())

let offset = 0
function draw() {
    for(let x=0;x<60;x++)for(let y=0;y<35;y++)display.draw(x,y,String.fromCharCode(offset+ y + x))
    offset++
}

setInterval(draw,100)