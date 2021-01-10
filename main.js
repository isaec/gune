const uWS = require('uWebSockets.js')
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
let playerName = require("./server/playerName")
const port = 4141

const { StringDecoder } = require('string_decoder')
const decoder = new TextDecoder('utf-8')

const MESSAGE_ENUM = Object.freeze({
    SELF_CONNECTED: "SELF_CONNECTED",
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    CLIENT_MESSAGE: "CLIENT_MESSAGE",
    CLIENT_ACTION: "CLIENT_ACTION",
    SERVER_ACTION: "SERVER_ACTION"
})

const app = uWS.App()


const addFile = (app, urlPath, filePath=urlPath) => {
    app.get(urlPath, (res,req) => {
        let file = fs.readFileSync(__dirname+filePath, function (err, data) {
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
addFile(app, "/dist/index.js")
addFile(app, "/src/Metrickal-Regular.otf")

let SOCKETS = []

app.ws("/ws", {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60*3,

    open: (ws, req) => {
        ws.id = uuidv4()
        ws.username = playerName.randomName()
        //subscribe the socket to relevent topics
        ws.subscribe(MESSAGE_ENUM.CLIENT_CONNECTED)
        ws.subscribe(MESSAGE_ENUM.CLIENT_DISCONNECTED)
        ws.subscribe(MESSAGE_ENUM.CLIENT_MESSAGE)
        //add the socket to sockets after creation
        SOCKETS.push(ws)
        console.log("\x1b[32m"+"opened"+"\x1b[0m"+" a %o",ws)
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

        ws.send(JSON.stringify(selfMsg)) //send the message to the new socket
        app.publish(MESSAGE_ENUM.CLIENT_CONNECTED, JSON.stringify(pubMsg)) //send to all subbed sockets

    },
    message: (ws, msg, isBinary) => {
        let clientMsg = JSON.parse(decoder.decode(msg))
        console.log("%o says %o",ws.username,clientMsg)
    },
    close: (ws, code, message) => {
        SOCKETS.find((socket, index) => {
            if (socket && socket.id === ws.id) SOCKETS.splice(index, 1)
        })
        console.log("\x1b[31m"+"closed"+"\x1b[0m"+" a %o",ws)

        let pubMsg = {
            type: MESSAGE_ENUM.CLIENT_DISCONNECTED,
            body: {
                id: ws.id,
                name: ws.name
            }
        }

        app.publish(MESSAGE_ENUM.CLIENT_DISCONNECTED, JSON.stringify(pubMsg)) //let the clients know

    },


}).listen(port, token => {
    token ?
    console.log(`Listening to port ${port}`) :
    console.log(`Failed to listen to port ${port}`)
})

console.log("Server started.")
 
