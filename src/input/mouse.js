const rot = require("rot-js")
const path = require("/shared/path")

module.exports.MouseHandler = function (engine) {
    this.engine = engine
    this.click = (event) => {

        const [x, y] = engine.display.eventToPosition(event)
        const player = engine.getPlayer()
        if (!player) return


        const adjX = player.x + x - Math.floor(this.engine.screen.width / 2),
                adjY = player.y + y - Math.floor(this.engine.screen.height / 2)

        //console.log(`clicked at ${x}, ${y} or ${adjX}, ${adjY} absolute`)

        //this is basically a demo... its not well done and shouldnt hang around
        const dij = path.Dij(this.engine.world.map, [
            {
                x: adjX,
                y: adjY
            }
        ], 50)



        let moveCord = path.rollDown(dij, new path.Cord(player.x, player.y), this.engine.world.entityAt)

        this.engine.actionHandler.handle({
            type: "move", data: [
                moveCord.x, moveCord.y
            ]
        })

        event.preventDefault()

    }
    this.mousemove = () => {
        console.log("mousemove!")
    }
}