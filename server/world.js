const rot = require("rot-js")
const gamemap = require("./gamemap.js")
const clone = require("rfdc")()
const Entity = require("../shared/entity").Entity
const EType = require("../shared/entity").Type

const MESSAGE_ENUM = require("./message").MESSAGE_ENUM

const randint = rot.RNG.getUniformInt.bind(rot.RNG.setSeed(
    Math.floor(Math.random() * 100000)
))

module.exports.World = function (width = 60, height = 35) {
    this.map = new gamemap.Map(width, height)
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
    this.entityAt = (x, y) => {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return true
        return false
    }
    this.validSpace = (room) => {
        let tries = 0
        while (tries < 50) {
            const y = randint(room.getLeft(), room.getRight()),
                x = randint(room.getTop(), room.getBottom())
            if (!this.entityAt(x, y)) { return [x, y] }
            else { tries++ }
        }
        return null
    }
    this.sendFullWorld = function (ws) {
        ws.send(
            JSON.stringify(
                {
                    type: MESSAGE_ENUM.SERVER_WORLDUPDATE,
                    body: {
                        world: { //only send the importent parts
                            map: {
                                width: this.map.width,
                                height: this.map.height,
                                tiles: this.map.tiles,
                            },
                            entities: this.entities
                        }
                    }
                }
            )
        )
    }
    this.updateClients = function (app, worldAction) {
        if (!worldAction) throw "need world action"
        app.publish(MESSAGE_ENUM.SERVER_ACTION,
            JSON.stringify(
                {
                    type: MESSAGE_ENUM.SERVER_ACTION,
                    body: {
                        action: worldAction.publish()
                    }
                }
            )
        )
    }
    this.sendEntities = function (app) {
        app.publish(MESSAGE_ENUM.SERVER_ENTITYUPDATE,
            JSON.stringify(
                {
                    type: MESSAGE_ENUM.SERVER_ENTITYUPDATE,
                    body: {
                        entities: this.entities
                    }
                }
            )
        )
    }


    //processing and spawning, temp location
    for (const room of this.map.digger.getRooms()) {
        let b = this.validSpace(room)
        let x = b[0], y = b[1]
        this.add(new Entity(
            Math.floor(Math.random() * 2) == 1 ? EType.devil : EType.imp
            , x, y))
    }
}
