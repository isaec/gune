module.exports.World = function() {
    this.map = "wip lol"
    this.entities = new Array()
    this.createEntity = function(type, x, y, name=false) {
        if(!name) name = type + ++this.createEntity.id
        let entity = {name:name,type:type,x:x,y:y}
        this.entities.push(entity)
        return entity
    }
    this.createEntity.id = 0
}
