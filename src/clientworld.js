const FArray = require("/shared/array").FArray
module.exports.ClientWorld = function (world) {

    this.map = {
        width: world.map.width,
        height: world.map.height,
        tiles: new FArray(world.map.width, world.map.tiles._data),
    }

    this.entities = world.entities

    this.seenMap = {
        width: world.map.width,
        height: world.map.height,
        tiles: new FArray(world.map.width),
    }


    this.update = (world) => {
            this.map.width = world.map.width,
            this.map.height = world.map.height
            this.map.tiles = new FArray(world.map.width, world.map.tiles._data)
    
        this.entities = world.entities
    }
    this.entityUpdate = (entities) => this.entities = entities
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
            this.map.tiles.set(tileAction.x, tileAction.y, tileAction.value)
        }
        //delete any elements that were deleted
        for (const uuid of actions.delete) {
            for (const [index, entity] of this.entities.entries()) {
                if (entity.id === uuid) {
                    this.entities.splice(index, 1)
                    break
                }
            }
        }
    }
}