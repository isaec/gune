import * as rot from "rot-js"
const url = "ws://localhost:4141/ws"
const connection = new WebSocket(url)
const decoder = new TextDecoder('utf-8')

const display = new rot.Display({
    width: 60, 
    height: 35,
    fontSize:20,
    fontFamily:"metrickal, monospace",
    forceSquareRatio:true,
})

const MESSAGE_ENUM = Object.freeze({
    SELF_CONNECTED: "SELF_CONNECTED",
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    CLIENT_MESSAGE: "CLIENT_MESSAGE",
    CLIENT_ACTION: "CLIENT_ACTION",
    CLIENT_ALIVE: "CLIENT_ALIVE",
    SERVER_ACTION: "SERVER_ACTION"
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
            connection.send(JSON.stringify({
                type: MESSAGE_ENUM.CLIENT_ACTION,
                body: action,
            }))
        }
    }
}

connection.onopen = () => console.log("socket connected (onopen)")
connection.onclose = () => {
    console.log("websocket closed.")
    setTimeout(location.reload.bind(window.location),500)
}
connection.onmessage = msg => {
    const srvMsg = JSON.parse(msg.data)
    switch(srvMsg.type){

        case MESSAGE_ENUM.SERVER_ACTION: {
            console.log(srvMsg)
            console.log("worldstate is",srvMsg.body.world.entities)
            break
        }

        default: console.log(srvMsg)
    }
    
}

connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
}

window.setInterval(function(){
    connection.send(JSON.stringify( {
        type: MESSAGE_ENUM.CLIENT_ALIVE,
        body: {
        
        }
    }))
}, 1000*60)