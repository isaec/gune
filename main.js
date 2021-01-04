var express = require('express')
var app = express();

let fs = require("fs")

var server = require('http').createServer(app)
 
app.get('/',function(req, res) {
 res.sendFile(__dirname + '/client/index.html')
})
app.get("/game.js",function(req, res) {
    fs.createReadStream(__dirname+'/assets/game.js').pipe(res)
})
app.get("/rot.min.js",function(req, res) {
    res.setHeader("Content-Type", "text/javascript");
    fs.createReadStream(__dirname+'/rot.min.js').pipe(res)
    console.log("did somthing")
})
app.use('/client',express.static(__dirname + '/client'))
 
 
console.log("Server started.")
 
let SOCKET_LIST = {}

 
var io = require('socket.io')(server)
io.sockets.on('connection', function(socket){
              
        console.log('new user!')
        var socketId = Math.random()
        SOCKET_LIST[socketId] = socket
              
 
        socket.on('disconnect',function(){      
            delete SOCKET_LIST[socket.id]
        })
})
 
server.listen(4141)