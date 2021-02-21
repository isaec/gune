const FArray = require("/shared/array").FArray
const ConsoleLine = require("/src/display/guiconsole").ConsoleLine
module.exports = function (engine, world) {
    this.engine = engine

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


    this.update = (updatedWorld) => {

        this.map.width = updatedWorld.map.width
        this.map.height = updatedWorld.map.height
        this.map.tiles = new FArray(updatedWorld.map.width, updatedWorld.map.tiles._data)

        this.entities = updatedWorld.entities
    }
    this.entityUpdate = (entities) => this.entities = entities
    this.entityAt = (x, y) => {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return true
        return false
    }
    this.getEntityAt = (x, y) => {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return entity
        return undefined
    }
    this.getEntityAtConditional = (x, y, conditional) => {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return conditional(entity.x, entity.y) ? entity : undefined
        return undefined
    }
    this.applyActions = (actions) => {
        if (actions.actions) for (const action of actions.actions) {
            let done = false
            for (const [index, entity] of this.entities.entries()) {
                if (entity.id === action.id) {
                    //the entity has been found, so update it
                    this.entities[index] = action
                    done = true
                    break
                }
            }
            //if the entity did not exist, add it
            if (!done) this.entities.push(action)

        }
        if (actions.tileActions) for (const tileAction of actions.tileActions) {
            this.map.tiles.set(tileAction.x, tileAction.y, tileAction.value)
        }
        //delete any elements that were deleted
        if (actions.delete) for (const uuid of actions.delete) {
            for (const [index, entity] of this.entities.entries()) {
                if (entity.id === uuid) {
                    this.entities.splice(index, 1)
                    break
                }
            }
        }

        if (actions.logs) for (const log of actions.logs) {
            this.engine.guiConsole.print(new ConsoleLine(
                log.m, log.c, log.t, log.s
            ))
        }
    }
}