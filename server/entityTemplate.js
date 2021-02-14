const entity = require("../shared/entity")

module.exports = {
    [entity.Type.imp]: (x, y) => new entity.Entity(entity.Type.imp, x, y, 10),
    [entity.Type.devil]: (x, y) => new entity.Entity(entity.Type.devil, x, y, 15)
}