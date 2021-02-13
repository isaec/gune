const rot = require("rot-js")
const gamemap = require("./gamemap.js")

const randint = rot.RNG.getUniformInt.bind(rot.RNG.setSeed(
    Math.floor(Math.random() * 100000)
))

class World {
    constructor(width = 60, height = 35) {
        this.map = new gamemap.Map(width, height)
        this.entities = [] //new array
    }

    getEntity(uuid) {
        for (const [index, entity] of this.entities.entries()) {
            if (entity.id === uuid) {
                return [index, entity]
            }
        }
        return null
    }
    add(entity) { this.entities.push(entity) }
    entityAt(x, y) {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return true
        return false
    }
    getEntityAt(x, y) {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return entity
        return undefined
    }
    validSpace(room) {
        let tries = 0
        while (tries < 50) {
            const y = randint(room.getLeft(), room.getRight()),
                x = randint(room.getTop(), room.getBottom())
            if (!this.entityAt(x, y)) { return [x, y] }
            else { tries++ }
        }
        return null
    }
    randomRoom() {
        const rooms = this.map.digger._rooms
        return rooms[Math.floor(Math.random() * rooms.length)]
    }
}

module.exports = World