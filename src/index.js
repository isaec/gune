import * as rot from "rot-js"
const render = require("/src/render")
//const color = require("/src/color")
const guiconsole = require("/src/guiconsole")
const clientworld = require("/src/clientworld")
const key = require("/src/key")
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

const guiConsole = new guiconsole.GuiConsole()

const gameFigure = document.getElementById("game")
gameFigure.appendChild(display.getContainer())

let keyHandler = new key.KeyHandler(world, guiConsole, screen, uuid, connection)
const canvas = display.getContainer()
canvas.addEventListener('keydown', keyHandler.keydown)
canvas.addEventListener('keyup', keyHandler.keyup)
canvas.addEventListener('blur',()=>{keyHandler.pressed.clear()})
canvas.setAttribute('tabindex', "1")
canvas.focus()


//stupid fix to redraw world when font is ready
window.addEventListener("load", () => { screen.render(world) })


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
            keyHandler.world = world
            keyHandler.screen = screen
            screen.render(world)
            break
        }

        case MESSAGE_ENUM.SERVER_ENTITYUPDATE: {
            world.entityUpdate(srvMsg.body.entities)
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
            keyHandler.uuid = uuid
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