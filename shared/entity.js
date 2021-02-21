const { v4: uuidv4 } = require("uuid")
const playerName = require("../server/playerName")
const path = require("../shared/path")

class Entity {
    constructor(type, x, y, hp, faction, uuid = false, name = undefined) {
        if (!uuid) uuid = uuidv4()
        //if (!name) name = playerName.randomName(type.charAt(0))
        this.id = uuid
        this.name = name
        this.type = type
        this.x = x
        this.y = y
        this.hp = hp
        this.maxHp = hp
        this.faction = faction
    }
    static setAlive(entity, worldAction) {
        this.bleed(entity, worldAction)
        if (!entity.hp > 0) {
            worldAction.removeAnyId(entity.id, entity.type)
            return false
        }
        worldAction.changedAny(entity)
        return true
    }
    static bleed(entity, worldAction) {
        //this bleeding code is really convoluted
        for (let cord of path.fluidOffsets(entity.x, entity.y,
            ((x, y) => worldAction.world.map.tiles.get(x, y) === 2)
        )) {
            if (this.bleedTile(cord.x, cord.y, BloodInt[entity.type],
                worldAction.world.map.tiles.get(cord.x, cord.y), worldAction
            )) return
        }
    }
    static bleedTile(x, y, color, tile, worldAction) {
        if (tile === 5 || tile === color) return false
        worldAction.setTile(x, y,
            tile !== color && (tile === 3 || tile === 4) ? 5 : color
        )
        return true
    }
}

const Type = Object.freeze({
    player: "player",
    devil: "devil",
    imp: "imp"
})

const BloodInt = {
    [Type.player]: 3,
    [Type.devil]: 4,
    [Type.imp]: 3
}

module.exports = {
    Entity,
    Type,
}