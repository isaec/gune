module.exports.World = function() {
    this.map = "wip lol"
    this.entities = new Map()
    this.createEntity = function(type, x, y) {
        let id = ++this.createEntity.id
        let entity = {id,type,x,y}
        this.entities.set(id, entity)
        return entity
    }
    this.createEntity.id = 0
}
