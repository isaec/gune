const express = require('express')
const app = express()

const fs = require("fs")

const server = require('http').createServer(app)

app.get('/',function(req, res) {
 res.sendFile(__dirname + '/client/index.html')
})


app.use('/client',express.static(__dirname + '/client'))
app.use('/assets',express.static(__dirname + '/assets'))

app.get("*", function(req, res) {
    console.log("file requested not found")
    res.redirect("/client/error.html")
})
 
console.log("Server started.")
 
let SOCKET_LIST = {}

 
const io = require('socket.io')(server)
io.sockets.on('connection', function(socket){
              
        console.log('new user!')
        let socketId = Math.random()
        SOCKET_LIST[socketId] = socket
              
 
        socket.on('disconnect',function(){      
            delete SOCKET_LIST[socket.id]
        })
})
 
server.listen(4141)