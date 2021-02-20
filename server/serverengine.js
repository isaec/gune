const World = require("../server/world")

const action = require("../shared/action")

const path = require("../shared/path")

const entity = require("../shared/entity")
const entityTemplate = require("../server/entityTemplate")


const MESSAGE_ENUM = require("./message").MESSAGE_ENUM

class Engine {
    constructor() {
        this.world = new World(100, 100)
        this._spawnEntites(this.world)
    }
    _spawnEntites(world) {
        for (const room of world.map.digger.getRooms()) {
            let b = world.validSpace(room)
            world.add(entityTemplate["hellSpawn"](b[0], b[1]))
        }
    }
    //game logic zone

    npcTick(worldAction, player) {
        let dij = new path.Dij(this.world.map.width, this.world.map.tiles.get, [
            new path.Cord(player.x, player.y)
        ], 25)
        for (let ent of this.world.entities) {
            if (ent.type === entity.Type.player || ent.hp <= 0) continue
            let moveCord = path.rollDown(dij.distance, new path.Cord(ent.x, ent.y), this.world.entityAt.bind(this.world))
            if (moveCord) {
                ent.x += moveCord.x
                ent.y += moveCord.y
                worldAction.changedEntity(ent)
            }
        }
    }

    clientAction(id, act, worldAction) {
        let [, player] = this.world.getEntity(id)

        if (player) {

            action.addMethods(act)

            //if the move is valid
            if (act.validate(player, this, false)) {

                act.apply(player, this, worldAction)
                this.npcTick(worldAction, player)

                //worldAction.addLog("test")

            } else { //otherwise, remind clients where the misbehaving player is
                //this needs to be reviewed - can cause rubberbanding
                //worldAction.changedEntity(ent)
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