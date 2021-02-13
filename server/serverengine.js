const World = require("../server/world")

const action = require("../shared/action")

const path = require("../shared/path")

const entity = require("../shared/entity")

const MESSAGE_ENUM = require("./message").MESSAGE_ENUM

class Engine {
    constructor() {
        this.world = new World(100, 100)
        this._spawnEntites(this.world)
    }
    _spawnEntites(world) {
        for (const room of world.map.digger.getRooms()) {
            let b = world.validSpace(room)
            let x = b[0], y = b[1]
            world.add(new entity.Entity(
                Math.floor(Math.random() * 2) == 1 ? entity.Type.devil : entity.Type.imp
                , x, y))
        }
    }
    //game logic zone

    npcTick(worldAction, player) {
        let dij = new path.Dij(this.world.map.width, this.world.map.tiles.get, [
            new path.Cord(player.x, player.y)
        ], 25)
        for (let ent of this.world.entities) {
            if (ent.type === entity.Type.player) continue
            let moveCord = path.rollDown(dij.distance, new path.Cord(ent.x, ent.y), this.world.entityAt.bind(this.world))
            if (moveCord) {
                ent.x += moveCord.x
                ent.y += moveCord.y
                worldAction.changedEntity(ent)
            }
        }
    }


    //network zone
    sendFullWorld(ws) {
        ws.send(
            JSON.stringify(
                {
                    type: MESSAGE_ENUM.SERVER_WORLDUPDATE,
                    body: {
                        world: { //only send the importent parts
                            map: {
                                width: this.world.map.width,
                                height: this.world.map.height,
                                tiles: this.world.map.tiles,
                            },
                            entities: this.world.entities
                        }
                    }
                }
            )
        )
    }
    updateClients(app, worldAction) {
        if (!worldAction) throw "need world action"
        if(worldAction.empty()) return //dont send empty action
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
    sendEntities(app) {
        app.publish(MESSAGE_ENUM.SERVER_ENTITYUPDATE,
            JSON.stringify(
                {
                    type: MESSAGE_ENUM.SERVER_ENTITYUPDATE,
                    body: {
                        entities: this.world.entities
                    }
                }
            )
        )
    }

}

module.exports.Engine = Engine