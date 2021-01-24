import * as rot from "rot-js"
const render = require("/src/render")
//const color = require("/src/color")
const guiconsole = require("/src/guiconsole")
const clientworld = require("/src/clientworld")
const url = location.origin.replace(/^http/, 'ws') + "/ws"
const connection = new WebSocket(url)
//const decoder = new TextDecoder('utf-8')

let uuid, world, screen

const display = new rot.Display({
    width: 35,
    height: 35,
    fontFamily: "metrickal, monospace",
    forceSquareRatio: true,
})

const scaleDisplay = () => display.setOptions({ fontSize: Math.floor(window.innerHeight / 36) })
window.onresize = scaleDisplay
scaleDisplay()


const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM

const gameFigure = document.getElementById("game")
gameFigure.appendChild(display.getContainer())

const canvas = display.getContainer()
canvas.addEventListener('keydown', handleKeyDown)
canvas.setAttribute('tabindex', "1")
canvas.focus()

const guiConsole = new guiconsole.GuiConsole()

//stupid fix to redraw world when font is ready
window.addEventListener("load", () => { screen.render(world) })

function handleKeys(keyCode) {
    switch (keyCode){
        case rot.KEYS.VK_RIGHT:
        case rot.KEYS.VK_D:
            return { type: 'move', data: [+1, 0] }
        case rot.KEYS.VK_LEFT:
        case rot.KEYS.VK_A:
            return { type: 'move', data: [-1, 0] }
        case rot.KEYS.VK_DOWN:
        case rot.KEYS.VK_S:
            return { type: 'move', data: [0, +1] }
        case rot.KEYS.VK_UP:
        case rot.KEYS.VK_W:
            return { type: 'move', data: [0, -1] }
        default:
            return undefined
    }
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
            if (world.map.tiles[newY][newX] === 1 && !world.entityAt(newX, newY)) {
                connection.send(JSON.stringify({
                    type: MESSAGE_ENUM.CLIENT_ACTION,
                    body: action,
                }))
                //render the change on clientside pre approval
                //this should make movement feel more responsive
                player.x += dx
                player.y += dy
                screen.render(world)
            } else {
                guiConsole.print(
                    new guiconsole.ConsoleLine("that path is blocked", [4, 4, 2], true)
                )
            }
        }
    } else {
        //console.log("unhandled event %o", event)
    }
    event.preventDefault()
}

connection.onopen = () => {
    guiConsole.print(
        new guiconsole.ConsoleLine("websocket connected", [2, 4, 4])
    )
}

connection.onclose = () => {
    guiConsole.print(
        new guiconsole.ConsoleLine("websocket closed (server disconnect)", [5, 2, 2])
    )
    setTimeout(location.reload.bind(window.location), 500)
}
connection.onmessage = msg => {
    const srvMsg = JSON.parse(msg.data)
    switch (srvMsg.type) {

        case MESSAGE_ENUM.SERVER_WORLDUPDATE: {
            world = new clientworld.ClientWorld(srvMsg.body.world)
            screen = new render.Screen(display, uuid, world.map.width, world.map.height)
            screen.render(world)
            break
        }

        case MESSAGE_ENUM.SERVER_ACTION: {
            world.applyActions(srvMsg.body.action)
            screen.render(world)
            break
        }

        case MESSAGE_ENUM.SELF_CONNECTED: {
            uuid = srvMsg.body.id
            screen.uuid = uuid
            guiConsole.print(
                new guiconsole.ConsoleLine(`${srvMsg.body.name} (you) connected`, [4, 5, 3])
            )
            break
        }

        case MESSAGE_ENUM.CLIENT_CONNECTED: {
            if (srvMsg.body.id !== uuid) guiConsole.print(
                new guiconsole.ConsoleLine(`${srvMsg.body.name} connected`, [3, 5, 3])
            )
            break
        }

        case MESSAGE_ENUM.CLIENT_DISCONNECTED: {
            guiConsole.print(
                new guiconsole.ConsoleLine(`${srvMsg.body.name} disconnected`, [4, 2, 2])
            )
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