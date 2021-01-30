const rot = require("rot-js")
const path = require("/shared/path")
const guiconsole = require("/src/display/guiconsole")

module.exports.MouseHandler = function (engine) {
    this.engine = engine

    this.dij = undefined
    this.rate = 170

    this.click = (event) => {

        const [x, y] = engine.display.eventToPosition(event)
        const player = engine.getPlayer()
        if (!player) return


        const adjX = player.x + x - Math.floor(this.engine.screen.width / 2),
            adjY = player.y + y - Math.floor(this.engine.screen.height / 2)

        //console.log(`clicked at ${x}, ${y} or ${adjX}, ${adjY} absolute`)

        //this is basically a demo... its not well done and shouldnt hang around
        if (this.engine.world.map.tiles.get(adjX, adjY) !== 1) {
            this.engine.guiConsole.print(
                new guiconsole.ConsoleLine("that pathing goal is obstructed", [5, 3, 2], true)
            )
            return 
        }


        this.dij = path.Dij(this.engine.world.map, [
            {
                x: adjX,
                y: adjY
            }
        ], Infinity)

        this.intervalFunc()
        this.startInterval()

        event.preventDefault()

    }
    this.mousemove = () => {
        console.log("mousemove!")
    }

    this.intervalFunc = () => {
        const player = engine.getPlayer()
        if (!player) return

        let moveCord = path.rollDown(this.dij, new path.Cord(player.x, player.y), this.engine.world.entityAt)
        if (!moveCord) {
            this.stopInterval()
        } else {
            this.engine.actionHandler.handle({
                type: "move", data: [
                    moveCord.x, moveCord.y
                ]
            })
        }
    }
    this.interval = false

    this.stopInterval = () => { if (this.interval) clearInterval(this.interval) }

    this.startInterval = () => this.interval = setInterval(this.intervalFunc, this.rate)
}