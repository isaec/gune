const World = require("../server/world")

const Entity = require("../shared/entity").Entity
const EType = require("../shared/entity").Type

const MESSAGE_ENUM = require("./message").MESSAGE_ENUM

class Engine {
    constructor(){
        this.world = new World(100, 100)
        this._spawnEntites(this.world)
    }
    _spawnEntites(world){
        for (const room of world.map.digger.getRooms()) {
            let b = world.validSpace(room)
            let x = b[0], y = b[1]
            world.add(new Entity(
                Math.floor(Math.random() * 2) == 1 ? EType.devil : EType.imp
                , x, y))
        }
    }

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