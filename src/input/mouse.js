const rot = require("rot-js")

module.exports.MouseHandler = function (engine) {
    this.engine = engine
    this.click = (event) => {

        let [x, y] = engine.display.eventToPosition(event)

        console.log(`click at ${x}, ${y} in onscreen cords!`)
    }
    this.mousemove = () => {
        console.log("mousemove!")
    }
}