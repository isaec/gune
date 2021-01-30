const rot = require("rot-js")
const guiconsole = require("/src/display/guiconsole")
const MESSAGE_ENUM = require("/server/message").MESSAGE_ENUM

module.exports.KeyHandler = function (engine) {
    this.engine = engine

    this.pressed = new Set()
    this.buffer = new Set()
    this.validmoves = new Set([
        "w", "a", "s", "d",
    ])
    this.lastInput = undefined
    this.lastInputTime = performance.now()

    this.keydown = (event) => {
        if (!this.validmoves.has(event.key.toLowerCase()) || event.repeat || !event.isTrusted) return
        const key = event.key.toLowerCase()
        if (event.shiftKey) {
            this.buffer.add(key)
        } else {
            this.pressed.add(key)
            clearInterval(this.interval)

            if (performance.now() - this.lastInputTime < 70 && key === this.lastInput) {
                alert("macros are not allowed to reduce load on server. if you reached this input speed naturally, please contact isaac.")
            }
            this.lastInput = key
            this.lastInputTime = performance.now()

            this.intervalFunc()
            this.interval = setInterval(this.intervalFunc, this.spacing)
        }

        //post handle
        event.preventDefault()
    }
    this.keyup = (event) => {
        if (event.key == "Shift") this.clearBuffer()
        this.pressed.delete(event.key.toLowerCase())
    }
    this.spacing = 170
    this.intervalFunc = () => {
        this.emitAction(this.keysToMoveAction(this.pressed))
    }
    this.interval = setInterval(this.intervalFunc, this.spacing)

    this.clearBuffer = () => {
        this.emitAction(this.keysToMoveAction(this.buffer))
        this.buffer.clear()
    }
    this.keysToMoveAction = (keys) => {
        if (keys.size === 0) return
        let x = 0, y = 0

        for (const key of keys) {
            switch (key) {
                case "w": y--; break;
                case "a": x--; break;
                case "s": y++; break;
                case "d": x++; break;
                default: console.log("ruh roh, I see a", key)
            }
        }
        return !(x == 0 && y == 0) ? { type: "move", data: [x, y] } : undefined
    }

    this.emitAction = (action) => {
        if (action) {
            if (action.type === "move") {
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
        } else {
            //console.log("unhandled event %o", event)
        }
    }
}


