const { v4: uuidv4 } = require("uuid")
const playerName = require("../server/playerName")

class Entity {
    constructor(type, x, y, hp, uuid = false, name = undefined){
        if (!uuid) uuid = uuidv4()
        //if (!name) name = playerName.randomName(type.charAt(0))
        this.id = uuid
        this.name = name
        this.type = type
        this.x = x
        this.y = y
        this.hp = hp
        this.maxHp = hp
        this.alive = true
    }
    static setAlive(entity){
        entity.alive = entity.hp > 0
        if(!entity.alive) entity.type = Type.corpse
    }
}

const Type = Object.freeze({
    player: "player",
    corpse: "corpse",
    devil: "devil",
    imp: "imp"
})

module.exports = {
    Entity,
    Type,
}