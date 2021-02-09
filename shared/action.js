const guiconsole = require("/src/display/guiconsole")

class Action {
    constructor(type, taker) {
        this.type = type
        this.taker = taker
    }
    validate(engine, clientSide = true) {
        console.log(`action of type ${this.type} has no validate function`)
        return true
    }
}


class Move extends Action {
    constructor(taker, dx, dy) {
        super("move", taker)
        this.dx = dx
        this.dy = dy
        this.data = [dx, dy]
    }

    validate(engine, clientSide = true) {
        const newX = this.taker.x + this.dx, newY = this.taker.y + this.dy
        const entityAt = engine.world.getEntityAt(newX, newY)
        if (engine.world.map.tiles.get(newX, newY) === 1 && !entityAt) {
            if (clientSide) {
                this.taker.x += this.dx
                this.taker.y += this.dy
                engine.screen.render(engine.world)
            }
            return true
        } else {
            if (clientSide) {
                engine.guiConsole.print(
                    entityAt ?
                        new guiconsole.ConsoleLine(`that path is blocked by ${entityAt.type}`, [4, 3, 2], true)
                        :
                        new guiconsole.ConsoleLine("that path is blocked by terrain", [4, 4, 2], true)
                )
            }
            return false
        }
    }
}

module.exports.Move = Move