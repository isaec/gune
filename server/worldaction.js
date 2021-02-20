

const undef = (array) => array.length > 0 ? array : undefined

module.exports.WorldAction = function (world) {
    this.world = world
    this.actions = []
    this.delete = []
    this.tileActions = []
    this.logs = [] //use bitmask eventually
    this.addEntity = (entity) => {
        this.world.entities.push(entity)
        this.actions.push(entity)
    }

    this.removeEntityIndex = (index) => {
        this.delete.push(this.world.entities[index].id)
        this.world.entities.splice(index, 1)
    }
    this.removeEntityId = (id) => {
        const [index,] = this.world.getEntity(id)
        this.removeEntityIndex(index)
    }

    this.changedEntity = (entity) => this.actions.push(entity)

    this.setTile = (x, y, value) => {
        this.world.map.tiles.set(x, y, value)
        this.tileActions.push(
            {
                x: x,
                y: y,
                value: value
            }
        )
    }

    this.addLog = (consoleLine) => this.logs.push(consoleLine)

    this.empty = () => this.actions.length + this.delete.length + this.tileActions.length === 0

    this.publish = () => {
        return {
            actions: undef(this.actions),
            tileActions: undef(this.tileActions),
            delete: undef(this.delete),
            logs: undef(this.logs),
        }
    }
}