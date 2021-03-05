const render = require("/src/display/render")
//const color = require("/src/color")
const guiconsole = require("/src/display/guiconsole")
const clientworld = require("/src/data/clientworld")
const eng = require("/src/engine")
const url = location.origin.replace(/^http/, 'ws') + "/ws"
const connection = new WebSocket(url)
//const decoder = new TextDecoder('utf-8')

const engine = new eng.Engine(connection)

const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM



connection.onopen = () => {
    engine.guiConsole.print(
        new guiconsole.ConsoleLine("websocket connected", [2, 4, 4])
    )
}

connection.onclose = () => {
    console.log("websocket connection closed")
    engine.guiConsole.print(
        new guiconsole.ConsoleLine("websocket closed (server disconnect)", [5, 2, 2])
    )
    setTimeout(location.reload.bind(window.location), 500)
}
connection.onmessage = msg => {
    const srvMsg = JSON.parse(msg.data)
    switch (srvMsg.type) {

        case MESSAGE_ENUM.SERVER_WORLDUPDATE: {
            engine.loadWorld(srvMsg.body.world)
            break
        }

        case MESSAGE_ENUM.SERVER_ENTITYUPDATE: {
            engine.world.entityUpdate(srvMsg.body.entities)
            break
        }

        case MESSAGE_ENUM.SERVER_ACTION: {
            engine.world.applyActions(srvMsg.body.action)
            break
        }

        case MESSAGE_ENUM.SELF_CONNECTED: {
            engine.loadUuid(srvMsg.body.id)
            engine.guiConsole.print(
                new guiconsole.ConsoleLine(`${srvMsg.body.name} (you) connected`, [4, 5, 3])
            )
            break
        }

        case MESSAGE_ENUM.CLIENT_CONNECTED: {
            if (srvMsg.body.id !== engine.uuid) engine.guiConsole.print(
                new guiconsole.ConsoleLine(`${srvMsg.body.name} connected`, [3, 5, 3])
            )
            break
        }

        case MESSAGE_ENUM.CLIENT_DISCONNECTED: {
            engine.guiConsole.print(
                new guiconsole.ConsoleLine(`${srvMsg.body.name} disconnected`, [4, 2, 2])
            )
            break
        }

        default: console.log(srvMsg)
    }

}

connection.onerror = error => {
    console.log(`WebSocket error: ${error}`)
    engine.guiConsole.print(
        new guiconsole.ConsoleLine(`WebSocket error: ${error}`, [2, 4, 4])
    )
}

window.setInterval(function () {
    connection.send(JSON.stringify({
        type: MESSAGE_ENUM.CLIENT_ALIVE,
        body: {

        }
    }))
}, 1000 * 60)