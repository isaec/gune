const { v4: uuidv4 } = require("uuid")

module.exports.World = function() {
    this.makeMap = () => {return "test"}
    this.map = this.makeMap()
    this.entities = new Array()
    this.getEntity = function(uuid){
        for(const [index, entity] of this.entities.entries()){
            if(entity.id === uuid){
                return [index, entity]
            }
        }
        return null
    }
    this.createEntity = function(type, x, y, uuid=false) {
        if(!uuid) uuid = uuidv4()
        let entity = {id:uuid,type:type,x:x,y:y}
        this.entities.push(entity)
        return entity
    }
    this.updateClients = function(app) {
        app.publish("SERVER_ACTION"/*MESSAGE_ENUM.SERVER_ACTION*/, 
            JSON.stringify({
            type: "SERVER_ACTION"/*MESSAGE_ENUM.SERVER_ACTION*/,
            body: {
                world: this
            }
        }))
    }
}
