const { v4: uuidv4 } = require("uuid")

module.exports.Entity = function (type, x, y, uuid = false) {
    if (!uuid) uuid = uuidv4()
    this.id = uuid
    this.type = type
    this.x = x
    this.y = y
}