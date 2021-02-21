const uWS = require('uWebSockets.js')
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const playerName = require("./server/playerName")
const port = parseInt(process.env.PORT, 10) || 4141

const { StringDecoder } = require('string_decoder')
const decoder = new TextDecoder('utf-8')

const WorldAction = require("./server/worldaction").WorldAction
const entity = require("./shared/entity")
const faction = require("./shared/faction")
const Engine = require("./server/serverengine").Engine

const MESSAGE_ENUM = require("./server/message").MESSAGE_ENUM

const app = uWS.App()
let engine = new Engine()

const addFile = (targetApp, urlPath, filePath = urlPath) => {
    targetApp.get(urlPath, (res, req) => {
        let file = fs.readFileSync(__dirname + filePath, function (err, data) {
            if (err) {
                res.end(`Error getting the file: ${err}.`)
            } else {
                res.end(data)
            }
        });
        res.end(file)
    })
}

addFile(app, "/", "/client/index.html")
addFile(app, "/client/main.css")
addFile(app, "/dist/index.js")
addFile(app, "/client/Metrickal-Regular.otf")
addFile(app, "/favicon.ico", "/client/favicon.ico")


app.SOCKETS = []

app.ws("/ws", {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60 * 3,

    open: (ws, req) => {
        ws.id = uuidv4()
        ws.username = playerName.randomName()
        //subscribe the socket to relevent topics
        ws.subscribe(MESSAGE_ENUM.CLIENT_CONNECTED)
        ws.subscribe(MESSAGE_ENUM.CLIENT_DISCONNECTED)
        ws.subscribe(MESSAGE_ENUM.CLIENT_MESSAGE)
        ws.subscribe(MESSAGE_ENUM.SERVER_ACTION)
        ws.subscribe(MESSAGE_ENUM.SERVER_WORLDUPDATE)
        ws.subscribe(MESSAGE_ENUM.SERVER_ENTITYUPDATE)
        //add the socket to sockets after creation
        app.SOCKETS.push(ws)
        //console.log("\x1b[32m" + "opened" + "\x1b[0m" + " %o", ws)
        //let the socket know its name and uuid
        let selfMsg = {
            type: MESSAGE_ENUM.SELF_CONNECTED,
            body: {
                id: ws.id,
                name: ws.username
            }
        }

        //let all users know that a new client connected
        let pubMsg = {
            type: MESSAGE_ENUM.CLIENT_CONNECTED,
            body: {
                id: ws.id,
                name: ws.username
            }
        }
        //make a worldaction so we can keep track of changes easily
        let worldAction = new WorldAction(engine.world)

        //add this new connection as a player with a random position in the world
        const [tarX, tarY] = engine.world.validSpace(engine.world.randomRoom())
        worldAction.addP(new entity.Entity(entity.Type.player, tarX, tarY, 25, faction.gune, ws.id, ws.username))

        //send the socket the entire world
        engine.sendFullWorld(ws)

        engine.updateClients(app, worldAction) //update the world for the clients

        ws.send(JSON.stringify(selfMsg)) //send the message to the new socket
        app.publish(MESSAGE_ENUM.CLIENT_CONNECTED, JSON.stringify(pubMsg)) //send to all subbed sockets


    },
    message: (ws, msg, isBinary) => {
        let clientMsg = JSON.parse(decoder.decode(msg))
        switch (clientMsg.type) {

            case MESSAGE_ENUM.CLIENT_ALIVE: {
                break
            }

            case MESSAGE_ENUM.CLIENT_ACTION: {
                
                let worldAction = new WorldAction(engine.world)
                
                engine.clientAction(ws.id, clientMsg.body, worldAction)

                engine.updateClients(app, worldAction)
                break
            }

            default: console.log("%o says %o", ws.username, clientMsg)
        }

    },
    close: (ws, code, message) => {
        app.SOCKETS.find((socket, i) => { //removes socket
            if (socket && socket.id === ws.id) app.SOCKETS.splice(i, 1)
        })
        const [index, ent] = engine.world.getE(ws.id)
        if (ent) {
            let worldAction = new WorldAction(engine.world)
            worldAction.removeEntityIndex(index)
            engine.updateClients(app, worldAction)
        }


        //console.log("\x1b[31m" + "closed" + "\x1b[0m" + " %o", ws)

        let pubMsg = {
            type: MESSAGE_ENUM.CLIENT_DISCONNECTED,
            body: {
                id: ws.id,
                name: ws.username
            }
        }

        //let the clients know about the disconnect

        app.publish(MESSAGE_ENUM.CLIENT_DISCONNECTED, JSON.stringify(pubMsg))

    },


}).listen(port, token => {
    token ?
        console.log(`Listening to port ${port}`) :
        console.log(`Failed to listen to port ${port}`)
})

console.log("Server started.")

