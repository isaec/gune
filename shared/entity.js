const { v4: uuidv4 } = require("uuid")
const playerName = require("../server/playerName")

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
        worldAction.setTile(entity.x, entity.y, BloodInt[entity.type])
        if (!entity.hp > 0) worldAction.removeEntityId(entity.id)
        else worldAction.changedEntity(entity)
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