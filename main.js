const uWS = require('uWebSockets.js')
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const playerName = require("./server/playerName")
const port = parseInt(process.env.PORT, 10) || 4141

const { StringDecoder } = require('string_decoder')
const decoder = new TextDecoder('utf-8')

const wrld = require("./server/world")
const entity = require("./server/entity")

const MESSAGE_ENUM = require("./server/message").MESSAGE_ENUM

const app = uWS.App()


const addFile = (app, urlPath, filePath = urlPath) => {
    app.get(urlPath, (res, req) => {
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

//gamecode setup block

let world = new wrld.World()

//end gamecode setup block


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
        //add the socket to sockets after creation
        app.SOCKETS.push(ws)
        console.log("\x1b[32m" + "opened" + "\x1b[0m" + " %o", ws)
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

        const room = world.map.digger.getRooms()[0]
        //make the new player for the uuid
        world.add(new entity.Entity("player", room._x1, room._y1, ws.id))

        world.updateClients(app) //update the world for the clients

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
                let [i, entity] = world.getEntity(ws.id)
                
                if (entity) {

                    let newX = entity.x + clientMsg.body.data[0],
                    newY = entity.y + clientMsg.body.data[1]

                    //if the move is valid
                    if(world.map.tiles[newY][newX] === 1){

                        //move the player
                        entity.x += clientMsg.body.data[0]
                        entity.y += clientMsg.body.data[1]
                        
                    }

                    
                }
                world.updateClients(app)
                break
            }

            default: console.log("%o says %o", ws.username, clientMsg)
        }

    },
    close: (ws, code, message) => {
        app.SOCKETS.find((socket, index) => { //removes socket
            if (socket && socket.id === ws.id) app.SOCKETS.splice(index, 1)
        })
        const [index, entity] = world.getEntity(ws.id)
        if (entity) {
            world.entities.splice(index, 1)
            world.updateClients(app)
        }


        console.log("\x1b[31m" + "closed" + "\x1b[0m" + " %o", ws)

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

