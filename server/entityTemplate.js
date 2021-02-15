const entity = require("../shared/entity")
const Entity = entity.Entity
const eType = entity.Type

const lootTable = require("../shared/lootTable")
const hellSpawn = new lootTable([
    [eType.imp, 3],
    [eType.devil, 1]
])


const entityTemplate = {
    [entity.Type.imp]: (x, y) => new Entity(eType.imp, x, y, 10),
    [entity.Type.devil]: (x, y) => new Entity(eType.devil, x, y, 15),
    ["hellSpawn"]: (x, y) => entityTemplate[hellSpawn.elem](x, y)
}
module.exports = entityTemplate