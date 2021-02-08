const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM
const guiconsole = require("/src/display/guiconsole")

module.exports.ActionHandler = function (engine) {
    this.engine = engine

    this.handle = (action) => {
        if(!action) return "no action"

        const player = engine.getPlayer()
        const dx = action.data[0], dy = action.data[1]
        const newX = player.x + dx, newY = player.y + dy
        const entityAt = this.engine.world.getEntityAt(newX, newY)
        if (this.engine.world.map.tiles.get(newX, newY) === 1 && !entityAt) {
            this.engine.connection.send(JSON.stringify({
                type: MESSAGE_ENUM.CLIENT_ACTION,
                body: action,
            }))
            //render the change on clientside pre approval
            //this should make movement feel more responsive
            player.x += dx
            player.y += dy
            this.engine.screen.render(this.engine.world)
        } else {
            this.engine.guiConsole.print(
                entityAt ? 
                new guiconsole.ConsoleLine(`that path is blocked by ${entityAt.type}`, [4, 3, 2], true)
                :
                new guiconsole.ConsoleLine("that path is blocked by terrain", [4, 4, 2], true)
            )
            return "illegal move"
        }
    }
}