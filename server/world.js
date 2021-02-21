const rot = require("rot-js")
const gamemap = require("./gamemap.js")

const randint = rot.RNG.getUniformInt.bind(rot.RNG.setSeed(
    Math.floor(Math.random() * 100000)
))

class World {
    constructor(width = 60, height = 35) {
        this.map = new gamemap.Map(width, height)
        this.entities = [] //new array
        this.players = [] //keeping in own array speeds lookup
        //long term, a different data solution would be better
    }

    getEntity(uuid) {
        for (const [index, entity] of this.entities.entries()) {
            if (entity.id === uuid) {
                return [index, entity]
            }
        }
        return [undefined, undefined]
    }
    getPlayer(uuid) {
        for (const [index, player] of this.players.entries()) {
            if (player.id === uuid) {
                return [index, player]
            }
        }
        return [undefined, undefined]
    }
    addE(entity) { this.entities.push(entity) }
    addP(player) { this.players.push(player) }
    entityAt(x, y) {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return true
        return false
    }
    playerAt(x, y) {
        for (const player of this.players) if (player.x === x && player.y === y) return true
        return false
    }
    anyAt(x, y) {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return true
        for (const player of this.players) if (player.x === x && player.y === y) return true
        return false
    }
    getEntityAt(x, y) {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return entity
        return undefined
    }
    getPlayerAt(x, y) {
        for (const player of this.players) if (player.x === x && player.y === y) return player
        return undefined
    }
    getAnyAt(x, y) {
        for (const entity of this.entities) if (entity.x === x && entity.y === y) return entity
        for (const player of this.players) if (player.x === x && player.y === y) return player
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