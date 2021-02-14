const { v4: uuidv4 } = require("uuid")
const playerName = require("../server/playerName")

module.exports.Entity = function (type, x, y, hp = 10, uuid = false, name = undefined) {
    if (!uuid) uuid = uuidv4()
    //if (!name) name = playerName.randomName(type.charAt(0))
    this.id = uuid
    this.name = name
    this.type = type
    this.x = x
    this.y = y
    this.hp = hp
    this.maxHp = hp
}

module.exports.Type = Object.freeze({
    player: "player",
    devil: "devil",
    imp: "imp"
})