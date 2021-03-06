const guiconsole = require("../src/display/guiconsole")

const Entity = require("../shared/entity")

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
    apply(taker, engine, worldAction) {
        console.log(`action of type ${this.type} has no apply function`)
    }
    static addMethods(action) {
        console.log(`action of type ${this.type} has no addMethods function`)
    }
}

const totalDistLessThen = (taker, x, y, max) => (Math.abs(taker.x - x) <= max && Math.abs(taker.y - y) <= max)


class Move extends Action {
    constructor(dx, dy) {
        super(Type.move, dx, dy)
        addMethods(this)
    }
    static addMethods(action) {
        action.validate = function (taker, engine, clientSide = true) {
            const newX = taker.x + this.dx, newY = taker.y + this.dy
            const entityAt = engine.world.getAnyAt(newX, newY)
            if ( //if the move is to an open tile
                engine.world.map.tiles.get(newX, newY) !== 2
                && //if there is no entity in the way
                !entityAt
                && //if the distance being moved is only 1 tile
                totalDistLessThen(taker, newX, newY, 1)
                && //and the taker is alive
                taker.hp > 0
            ) {
                /* 
                this is clientside prediction for move
                given all the new calculations, and how unrealistic <16 ms ping is
                it can cause graphical glitches
                ive elected to turn it off for the time being
                in the future, this sort of thing should be a setting
                it makes the game more responsive if your connection is bad
                and still helps at bit at the cost of graphical glitch (flicker)
                if your network is only meh (50-200ms) 
                */
                // if (clientSide) {
                //     this.apply(taker, engine)
                // }
                return true
            } else {
                if (clientSide) {
                    engine.guiConsole.print(
                        entityAt ?
                            new guiconsole.ConsoleLine(`that path is blocked by \
                            ${entityAt.type}`, [4, 3, 2], true)
                            :
                            new guiconsole.ConsoleLine(`that path is blocked by \
                            terrain`, [4, 4, 2], true)
                    )
                }
                return false
            }
        }

        action.apply = function (taker, engine, worldAction = undefined) {
            taker.x += this.dx
            taker.y += this.dy
            if (worldAction) worldAction.changedP(taker)
        }
    }
}

class Melee extends Action {
    constructor(dx, dy) {
        super(Type.melee, dx, dy)
        addMethods(this)
    }
    static addMethods(melee) {
        melee.validate = function (taker, engine, clientSide = true) {
            const newX = taker.x + this.dx, newY = taker.y + this.dy
            const entityAt = engine.world.getAnyAt(newX, newY)
            if (clientSide) {
                if (taker.faction === entityAt.faction) {
                    engine.guiConsole.print(
                        new guiconsole.ConsoleLine(`you can't attack someone if you share \
                    a faction`, [4, 2, 4], true)
                    )
                    return false
                }
                // if (!entityAt.alive) {
                //     engine.guiConsole.print(
                //         new guiconsole.ConsoleLine(`you can't attack an inanimate object`,
                //             [3, 2, 4], true)
                //     )
                //     return false
                // }
            }
            //if there is an entity at this location
            return entityAt
                && //and if the location is only one tile away
                totalDistLessThen(taker, newX, newY, 1)
                && //and the combatents don't share a faction
                taker.faction !== entityAt.faction
                && //and the taker is alive
                taker.hp > 0
        }
        melee.apply = function (taker, engine, worldAction = undefined) {
            let target = engine.world.getEntityAt(taker.x + this.dx, taker.y + this.dy)
            target.hp = Math.max(target.hp - 5, 0)
            if (worldAction) {
                if (Entity.Entity.setAlive(target, worldAction)) {
                    worldAction.addLog(`${taker.name ? taker.name : taker.type} slaps \
                    ${target.name ? target.name : target.type} for 5 damage`, [4, 2, 3])
                } else {
                    worldAction.addLog(`${taker.name ? taker.name : taker.type} slaps \
                    the life out of ${target.name ? target.name : target.type}`, [3, 2, 4])
                }

            }
            //should check
            else { console.log("why has this happened?") }
        }
    }
}


function addMethods(action) {
    switch (action.type) {
        case Type.move:
            Move.addMethods(action)
            break
        case Type.melee:
            Melee.addMethods(action) //not written
            break
        default:
            throw `unknown move type ${action.type}`
    }
}


module.exports = {
    Move,
    Melee,
    addMethods
}