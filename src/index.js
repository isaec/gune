import * as rot from "rot-js"
const render = require("/src/render.js")
const url = location.origin.replace(/^http/, 'ws')+"/ws"
const connection = new WebSocket(url)
const decoder = new TextDecoder('utf-8')

let uuid, world

const display = new rot.Display({
    width: 60,
    height: 35,
    fontSize: 20,
    fontFamily: "metrickal, monospace",
    forceSquareRatio: true,
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

const screen = new render.Screen(display)

//stupid fix to redraw world when font is ready
window.addEventListener("load", () => {screen.render(world)})

function handleKeys(keyCode) {
    const actions = {
        [rot.KEYS.VK_RIGHT]:
            () => { return { type: 'move', data: [+1, 0] } },
        [rot.KEYS.VK_LEFT]:
            () => { return { type: 'move', data: [-1, 0] } },
        [rot.KEYS.VK_DOWN]:
            () => { return { type: 'move', data: [0, +1] } },
        [rot.KEYS.VK_UP]:
            () => { return { type: 'move', data: [0, -1] } },
    }
    let action = actions[keyCode]
    return action ? action() : undefined
}

function handleKeyDown(event) {
    let action = handleKeys(event.keyCode)
    if (action) {
        if (action.type === "move") {
            const player = (() => {
                for (const entity of world.entities) {
                    if (entity.id === uuid) {
                        return entity
                    }
                }
                alert("this should not have happened.")
                return null
            })()
            const dx = action.data[0], dy = action.data[1]
            const newX = player.x + dx, newY = player.y + dy
            if (world.map.tiles[newY][newX] === 0) {
                connection.send(JSON.stringify({
                    type: MESSAGE_ENUM.CLIENT_ACTION,
                    body: action,
                }))
                //render the change on clientside pre approval
                //this should make movement feel more responsive
                player.x += dx
                player.y += dy
                screen.render(world)
            }
        }
    } else {
        //console.log("unhandled event %o", event)
    }
    event.preventDefault()
}

connection.onopen = () => console.log("socket connected (onopen)")
connection.onclose = () => {
    console.log("websocket closed.")
    setTimeout(location.reload.bind(window.location), 500)
}
connection.onmessage = msg => {
    const srvMsg = JSON.parse(msg.data)
    switch (srvMsg.type) {

        case MESSAGE_ENUM.SERVER_ACTION: {
            world = srvMsg.body.world
            screen.render(world)
            break
        }

        case MESSAGE_ENUM.SELF_CONNECTED: {
            uuid = srvMsg.body.id
            break
        }

        default: console.log(srvMsg)
    }

}

connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
}

window.setInterval(function () {
    connection.send(JSON.stringify({
        type: MESSAGE_ENUM.CLIENT_ALIVE,
        body: {

        }
    }))
}, 1000 * 60)