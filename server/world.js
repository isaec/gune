const rot = require("rot-js")
const gamemap = require("./gamemap.js")
const clone = require("rfdc")()

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
    this.entities = [] //new array
    this.getEntity = function (uuid) {
        for (const [index, entity] of this.entities.entries()) {
            if (entity.id === uuid) {
                return [index, entity]
            }
        }
        return null
    }
    this.add = function (entity) { this.entities.push(entity) }
    this.updateClients = function (app) {
        //loop through the entities
        //if they have a websocket connection, let them know what changed
        //this is a first draft of the loop - this loop will be run often
        //so this would be a good place to optimize network performance
        //there is a lot wrong with this code

        let playerId = [] //make array of player uuid
        let playerWs = [] //make array of player ws that lines up
        for (const ws of app.SOCKETS) {
            playerId.push(ws.id)
            playerWs.push(ws)
        }


        for (const entity of this.entities) {

            const index = playerId.indexOf(entity.id)

            //if the id is present
            if (index > -1) {
                //make a worldUpdate
                let worldUpdate = new WorldUpdate(this, entity.x, entity.y)
                //send the websocket a world update
                playerWs[index].send(
                    JSON.stringify(
                        {
                            type: MESSAGE_ENUM.SERVER_ACTION,
                            body: {
                                world: worldUpdate.update()
                            }
                        }
                    )
                )
            }

        }
    }
}

class WorldUpdate {

    constructor(world, entx, enty) {

        this.map = {
            width: world.map.width,
            height: world.map.height,
            tiles: Array.from({ length: world.map.width }, () => [])
        }
        this.entities = []


        let fov = new rot.FOV.PreciseShadowcasting((x, y) => {
            if (//make sure not to test cords out of bounds
                (x > this.map.width || x < 0)
                ||
                (y > this.map.height || y < 0)
            ) return false
            return world.map.tiles[y][x] === 1
        })

        //values from true to false
        let isLit = Array.from({ length: this.map.width }, () => [])
        fov.compute(entx, enty, 10, (x, y, r, visibility) => isLit[y][x] = visibility > 0.0)


        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                this.map.tiles[y][x] = isLit[y][x] ? world.map.tiles[y][x] : 0
            }
        }

        for(const entity of world.entities){
            if(isLit[entity.y][entity.x]) this.entities.push(entity)
        }


    }

    update() {
        return {
            map: this.map,
            entities: this.entities
        }
    }

}
