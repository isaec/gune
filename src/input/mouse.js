const rot = require("rot-js")
const path = require("/shared/path")
const guiconsole = require("/src/display/guiconsole")
const FArray = require("/shared/array").FArray

module.exports.MouseHandler = function (engine) {
    this.engine = engine

    this.dij = undefined
    this.rate = 160

    this.eventParse = (event) => {
        const [x, y] = engine.display.eventToPosition(event)
        const player = engine.getPlayer()
        if (!player) return [x, y, undefined, undefined, undefined]
        return [x, y,
            player.x + x - Math.floor(this.engine.screen.width / 2),
            player.y + y - Math.floor(this.engine.screen.height / 2),
            player]
    }

    this.knownTile = (x, y) => this.engine.world.seenMap.tiles.get(x, y) ? this.engine.world.map.tiles.get(x, y) : 1

    this.click = (event) => {

        const [x, y, adjX, adjY, player] = this.eventParse(event)
        if (!player) return

        //this is basically a demo... its not well done and shouldnt hang around
        if (this.knownTile(adjX, adjY) !== 1) {
            this.engine.guiConsole.print(
                new guiconsole.ConsoleLine("that pathing goal is obstructed", [5, 3, 2], true)
            )
            return
        }


        this.dij = new path.Dij(this.engine.world.map.width, this.knownTile, [
            new path.Cord(adjX, adjY)
        ], 140)

        this.startInterval()

        event.preventDefault()

    }
    this.mousemove = (event) => {
        //
    }

    this.intervalFunc = () => {
        const player = engine.getPlayer()
        if (!player) return

        let moveCord = path.rollDown(this.dij.distance, new path.Cord(player.x, player.y), this.engine.world.entityAt)
        if (!moveCord) {
            this.stopInterval()
        } else {
            if (this.engine.actionHandler.handle({
                type: "move", data: [
                    moveCord.x, moveCord.y
                ]
            }) !== undefined) {
                let target = this.dij.goalArray[0]
                if (this.knownTile(target.x, target.y) !== 1) {
                    this.engine.guiConsole.print(
                        new guiconsole.ConsoleLine("that pathing goal has been revealed to be obstructed", [3, 1, 2], true)
                    )
                    this.stopInterval()
                }
                this.dij.calc()
            }
        }
    }
    this.interval = false

    this.stopInterval = () => { if (this.interval) clearInterval(this.interval) }

    this.startInterval = () => {
        this.stopInterval()
        this.interval = setInterval(this.intervalFunc, this.rate)
    }
}