
const eType = require("../shared/entity").Type
const undef = (array) => array.length > 0 ? array : undefined

module.exports.WorldAction = function (world) {
    this.world = world
    this.eActions = []
    this.pActions = []
    this.eDelete = []
    this.pDelete = []
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

    this.removeEIndex = (index) => {
        this.eDelete.push(this.world.entities[index].id)
        this.world.entities.splice(index, 1)
    }
    this.removePIndex = (index) => {
        this.pDelete.push(this.world.players[index].id)
        this.world.players.splice(index, 1)
    }
    this.removeEId = (id) => {
        const [index,] = this.world.getE(id)
        this.removeEIndex(index)
    }
    this.removePId = (id) => {
        const [index,] = this.world.getP(id)
        this.removePIndex(index)
    }
    this.removeAnyId = (id, type) => {
        if (type === eType.player) this.removePId(id)
        else this.removeEId(id)
    }

    this.changedE = (entity) => this.eActions.push(entity)
    this.changedP = (player) => this.pActions.push(player)
    this.changedAny = (any) => any.type === eType.player ? this.changedP(any) : this.changedE(any)

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

    this.empty = () =>
        this.pActions.length +
        this.eActions.length +
        this.pDelete.length +
        this.eDelete.length +
        this.tileActions.length === 0

    this.publish = () => {
        return {
            eActions: undef(this.eActions),
            pActions: undef(this.pActions),
            tileActions: undef(this.tileActions),
            eDelete: undef(this.eDelete),
            pDelete: undef(this.pDelete),
            logs: undef(this.logs),
        }
    }
}