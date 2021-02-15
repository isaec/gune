//this import is an ugly mess but ill fix it *later*
let guiconsole
try {
    guiconsole = require("../src/display/guiconsole")
} catch (e) {
    guiconsole = undefined
    //automatic but its good to be clear
}

const Type = Object.freeze({
    move: "move",
    melee: "melee",
})
module.exports.Type = Type

class Action {
    constructor(type, dx, dy) {
        this.type = type
        this.dx = dx
        this.dy = dy
    }
    validate(taker, engine, clientSide = true) {
        console.log(`action of type ${this.type} has no validate function`)
        return true
    }
    apply(taker, engine) {
        console.log(`action of type ${this.type} has no apply function`)
    }
}


class Move extends Action {
    constructor(dx, dy) {
        super(Type.move, dx, dy)
        addMethods(this)
    }
}

class Melee extends Action {
    constructor(dx, dy) {
        super(Type.melee, dx, dy)
        addMethods(this)
    }
}


function addMethods(action) {
    switch (action.type) {
        case Type.move:
            //move block
            action.validate = function (taker, engine, clientSide = true) {
                const newX = taker.x + this.dx, newY = taker.y + this.dy
                const entityAt = engine.world.getEntityAt(newX, newY)
                if (engine.world.map.tiles.get(newX, newY) === 1 && !entityAt && (Math.abs(taker.x - newX) <= 1 && Math.abs(taker.y - newY) <= 1)) {
                    if (clientSide) {
                        this.apply(taker, engine)
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

            action.apply = function (taker,) {
                taker.x += this.dx
                taker.y += this.dy
            }
            //end move block
            break
        default:
            throw `unknown move type ${action.type}`
    }
}


module.exports.Move = Move
module.exports.addMethods = addMethods