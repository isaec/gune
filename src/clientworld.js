module.exports.ClientWorld = function(world) {
    this.map = world.map
    this.entities = world.entities
    this.update = (world) => {
        this.map = world.map
        this.entities = world.entities
    }
}