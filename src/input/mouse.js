const rot = require("rot-js")

module.exports.MouseHandler = function (display) {
    this.display = display
    this.click = (event) => {

        let [x, y] = display.eventToPosition(event)

        console.log(`click at ${x}, ${y} in onscreen cords!`)
    }
    this.mousemove = () => {
        console.log("mousemove!")
    }
}