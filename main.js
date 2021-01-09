//const express = require('express')
//const app = express()

const uWS = require('uWebSockets.js')
const fs = require("fs")
const uuid = require("uuidv4")
const port = 4141

//const server = require('http').createServer(app)
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')

// app.get('/',function(req, res) {
//  res.sendFile(__dirname + '/client/index.html')
// })


// app.use('/client',express.static(__dirname + '/client'))
// app.use('/src',express.static(__dirname + '/src'))
// app.use('/dist',express.static(__dirname + '/dist'))

const app = uWS.App()



const addFile = (app, urlPath, filePath) => {
    if(filePath==="=") filePath=urlPath
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
addFile(app, "/dist/index.js", "=")
addFile(app, "/src/Metrickal-Regular.otf", "=")

// app.get("*", function(req, res) {
//     console.log("file requested not found")
//     res.redirect("/client/error.html")
// })
 


app.ws("/ws", {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 300,

    open: (ws, req) => console.log("open"),
    message: ws => console.log("message"),
    close: (ws, code, message) => console.log("closed a ws"),


}).listen(port, token => {
    token ?
    console.log(`Listening to port ${port}`) :
    console.log(`Failed to listen to port ${port}`)
})

console.log("Server started.")
 
