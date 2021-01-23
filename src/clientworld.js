module.exports.ClientWorld = function (world) {
    this.map = world.map
    this.entities = world.entities
    this.update = (world) => {
        this.map = world.map
        this.entities = world.entities
    }
    this.entityAt = (x, y) => {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return true
        return false
    }
    this.applyActions = (actions) => {
        //console.log(actions)
        for (const action of actions.actions) {
            let done = false
            for (const [index, entity] of this.entities.entries()) {
                if (entity.id === action.id) {
                    this.entities[index] = action
                    done = true
                    break
                }
            }
            if (!done) this.entities.push(action)

        }
        for (const tileAction of actions.tileActions) {
            this.map.tiles[tileAction.y][tileAction.x] = tileAction.value
        }
        //delete any elements that were deleted
        for(const uuid of actions.delete){
            for (const [index, entity] of this.entities.entries()) {
                if (entity.id === uuid) {
                    this.entities.splice(index,1)
                    break
                }
            }
        }
    }
}