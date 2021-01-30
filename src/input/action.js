const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM
const guiconsole = require("/src/display/guiconsole")

module.exports.ActionHandler = function (engine) {
    this.engine = engine

    this.handle = (action) => {
        if(!action) return

        const player = (() => {
            for (const entity of this.engine.world.entities) {
                if (entity.id === this.engine.uuid) {
                    return entity
                }
            }
            alert("this should not have happened.")
            return null
        })()
        const dx = action.data[0], dy = action.data[1]
        const newX = player.x + dx, newY = player.y + dy
        if (this.engine.world.map.tiles.get(newX, newY) === 1 && !this.engine.world.entityAt(newX, newY)) {
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
                new guiconsole.ConsoleLine("that path is blocked", [4, 4, 2], true)
            )
        }
    }
}