import * as rot from "rot-js"
const url = "ws://localhost:4141/ws"
const connection = new WebSocket(url)

const display = new rot.Display({
    width: 60, 
    height: 35,
    fontSize:20,
    fontFamily:"metrickal, monospace",
    forceSquareRatio:true,
    })

const gameFigure = document.getElementById("gameFigure")
gameFigure.appendChild(display.getContainer())

const canvas = display.getContainer()
canvas.addEventListener('keydown', handleKeyDown)
canvas.setAttribute('tabindex', "1")
canvas.focus()


function handleKeyDown(event){
    console.log(event)
}


connection.onopen = () => console.log("socket connected")
connection.onmessage = message => console.log(message.data)

connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
  }