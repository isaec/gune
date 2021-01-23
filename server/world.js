const rot = require("rot-js")
const gamemap = require("./gamemap.js")
const clone = require("rfdc")()
const Entity = require("./entity").Entity

const MESSAGE_ENUM = require("./message").MESSAGE_ENUM


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
        if(!worldAction) throw "need world action"
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
}


module.exports.WorldAction = function(world) {
    this.world = world
    this.actions = []
    this.delete = []
    this.tileActions = []
    this.addEntity = (entity) => {
        this.world.entities.push(entity)
        this.actions.push(entity)
    }

    this.removeEntity = (index) => {
        this.delete.push(this.world.entities[index].id)
        this.world.entities.splice(index,1)
    }

    this.changedEntity = (entity) => this.actions.push(entity)

    this.setTile = (x, y, value) => {
        this.world.map.tiles[y][x] = value
        this.tileActions.push(
            {
                x: x,
                y: y,
                value: value
            }
        )
    }
    this.publish = () => {
        return {
            actions: this.actions,
            tileActions: this.tileActions,
            delete: this.delete
        }
    }
}