const rot = require("rot-js")
const action = require("/shared/action")

module.exports.KeyHandler = function (engine) {
    this.engine = engine

    this.pressed = new Set()
    this.buffer = new Set()
    this.validmoves = new Set([
        "w", "a", "s", "d",
    ])
    this.inputs = 0

    this.antiMacro = setInterval(() => {
        if (this.inputs > 10) {
            alert(
                `You are making too many inputs a second.
This rule is in place to prevent server overloading.
You should know, macros are a bannable offence.
If there is a good and fair usecase for a macro...
it should be a feature! Make a feature request.
Stop using macros.`
            )
            this.pressed.clear()
            this.buffer.clear()
            window.close()
        }
        this.inputs = 0
    }, 1000)

    this.keydown = (event) => {
        this.engine.mouseHandler.stopInterval()
        if (!this.validmoves.has(event.key.toLowerCase()) || event.repeat || !event.isTrusted) return
        const key = event.key.toLowerCase()
        this.inputs++
        if (event.shiftKey) {
            this.buffer.add(key)
        } else {
            this.pressed.add(key)
            clearInterval(this.interval)

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
        this.engine.actionHandler.handle(this.keysToMoveAction(this.pressed))
    }
    this.interval = setInterval(this.intervalFunc, this.spacing)

    this.clearBuffer = () => {
        this.engine.actionHandler.handle(this.keysToMoveAction(this.buffer))
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
        return !(x == 0 && y == 0) ? new action.Move(this.engine.getPlayer(), x, y) : undefined
    }
}


