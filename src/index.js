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


function handleKeys(keyCode){
    const actions = {
        [rot.KEYS.VK_RIGHT]: () => ['move', +1, 0],
        [rot.KEYS.VK_LEFT]:  () => ['move', -1, 0],
        [rot.KEYS.VK_DOWN]:  () => ['move', 0, +1],
        [rot.KEYS.VK_UP]:    () => ['move', 0, -1],
    }
    let action = actions[keyCode]
    return action ? action(): undefined
}

function handleKeyDown(event){
    let action = handleKeys(event.keyCode)
    if (action){
        if(action[0] === "move"){
            connection.send(JSON.stringify(action))
        }
    }
}

connection.onopen = () => console.log("socket connected (onopen)")
connection.onclose = () => {
    console.log("websocket closed.")
    setTimeout(location.reload.bind(window.location),500)
}
connection.onmessage = message => console.log(message.data)

connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
  }