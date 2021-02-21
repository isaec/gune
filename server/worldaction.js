

const undef = (array) => array.length > 0 ? array : undefined

module.exports.WorldAction = function (world) {
    this.world = world
    this.eActions = []
    this.pActions = []
    this.delete = []
    this.tileActions = []
    this.logs = [] //use bitmask eventually
    this.addE = (entity) => {
        this.world.entities.push(entity)
        this.eActions.push(entity)
    }

    this.addP = (player) => {
        this.world.players.push(player)
        this.pActions.push(player)
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

    /*
    values will be undefined if nothing is passed
    undefined values will be stripped from JSON
    on clientside, default object value is used
    if undefined is passed for a param
    */

    this.addLog = (message, color, temp, stack) => this.logs.push(
        { //bitmap with templates would be much smaller
            m: message,
            c: color,
            t: temp,
            s: stack
        }
    )

    this.empty = () => this.pActions.length + this.eActions.length + this.delete.length + this.tileActions.length === 0

    this.publish = () => {
        return {
            eActions: undef(this.eActions),
            pActions: undef(this.pActions),
            tileActions: undef(this.tileActions),
            delete: undef(this.delete),
            logs: undef(this.logs),
        }
    }
}