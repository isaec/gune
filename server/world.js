
const gamemap = require("./gamemap.js")

const MESSAGE_ENUM = Object.freeze({
    SELF_CONNECTED: "SELF_CONNECTED",
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    CLIENT_MESSAGE: "CLIENT_MESSAGE",
    CLIENT_ACTION: "CLIENT_ACTION",
    CLIENT_ALIVE: "CLIENT_ALIVE",
    SERVER_ACTION: "SERVER_ACTION"
})


module.exports.World = function () {
    this.map = new gamemap.Map(60, 35)
    this.entities = new Array()
    this.getEntity = function (uuid) {
        for (const [index, entity] of this.entities.entries()) {
            if (entity.id === uuid) {
                return [index, entity]
            }
        }
        return null
    }
    this.add = function(entity){this.entities.push(entity)}
    this.updateClients = function (app, SOCKETS) {

        let worldUpdate = new WorldUpdate()
        worldUpdate.map = this.map
        worldUpdate.entities = this.entities

        app.publish(MESSAGE_ENUM.SERVER_ACTION,
            JSON.stringify({
                type: MESSAGE_ENUM.SERVER_ACTION,
                body: {
                    world: worldUpdate
                    }
                }
            )
        )
    }
}

class WorldUpdate {
    
}
