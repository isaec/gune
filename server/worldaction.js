module.exports.WorldAction = function (world) {
    this.world = world
    this.actions = []
    this.delete = []
    this.tileActions = []
    this.addEntity = (entity) => {
        this.world.entities.push(entity)
        this.actions.push(entity)
    }

    this.removeEntity = (index) => {
        this.delete.push(this.world.entities[index].id)
        this.world.entities.splice(index, 1)
    }

    this.changedEntity = (entity) => this.actions.push(entity)

    this.setTile = (x, y, value) => {
        this.world.map.tiles[y][x] = value
        this.tileActions.push(
            {
                x: x,
                y: y,
                value: value
            }
        )
    }
    this.empty = () => this.actions.length + this.delete.length + this.tileActions.length === 0

    this.publish = () => {
        return {
            actions: this.actions,
            tileActions: this.tileActions,
            delete: this.delete
        }
    }
}