const rot = require("rot-js")
const guiconsole = require("/src/guiconsole")
const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM

module.exports.KeyHandler = function(world, guiConsole, screen, uuid, connection) {
    this.world = world //stop doing this, write an engine
    this.guiConsole = guiConsole //also this
    this.screen = screen //engine asap
    this.uuid = uuid //this should all be in an engine class
    this.connection = connection
    this.keymap = new Map()
    this.keydown = (event) => {
        if(event.repeat || !event.isTrusted) return
        this.keymap[event.keyCode] = true

        const action = this.keyToAction(event.keyCode)
        this.emitAction(action)

        //post handle
        event.preventDefault()
    }
    this.keyup = (event) => {
        this.keymap[event.keyCode] = false
    }

    this.keyToAction = (keyCode) => {
        switch (keyCode){ //is switch the right structure?
            case rot.KEYS.VK_RIGHT:
            case rot.KEYS.VK_D:
                return { type: 'move', data: [+1, 0] }
            case rot.KEYS.VK_LEFT:
            case rot.KEYS.VK_A:
                return { type: 'move', data: [-1, 0] }
            case rot.KEYS.VK_DOWN:
            case rot.KEYS.VK_S:
                return { type: 'move', data: [0, +1] }
            case rot.KEYS.VK_UP:
            case rot.KEYS.VK_W:
                return { type: 'move', data: [0, -1] }
            default:
                return undefined
        }
    }

    this.emitAction = (action) => {
        if (action) {
            if (action.type === "move") {
                const player = (() => {
                    for (const entity of this.world.entities) {
                        if (entity.id === this.uuid) {
                            return entity
                        }
                    }
                    alert("this should not have happened.")
                    return null
                })()
                const dx = action.data[0], dy = action.data[1]
                const newX = player.x + dx, newY = player.y + dy
                if (this.world.map.tiles.get(newX,newY) === 1 && !this.world.entityAt(newX, newY)) {
                    this.connection.send(JSON.stringify({
                        type: MESSAGE_ENUM.CLIENT_ACTION,
                        body: action,
                    }))
                    //render the change on clientside pre approval
                    //this should make movement feel more responsive
                    player.x += dx
                    player.y += dy
                    this.screen.render(this.world)
                } else {
                    this.guiConsole.print(
                        new guiconsole.ConsoleLine("that path is blocked", [4, 4, 2], true)
                    )
                }
            }
        } else {
            //console.log("unhandled event %o", event)
        }
    }
}


