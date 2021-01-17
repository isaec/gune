const rot = require("rot-js")

//takes values 0 to 5, and then scales them based on light levels
module.exports.Color = function (r, g, b) {
    this.r = r
    this.g = g
    this.b = b
    this.rgb = [r, g, b]
    this.rgb = (light = 1) => [
        (this.r * 51 * light),
        (this.g * 51 * light),
        (this.b * 51 * light)
    ]
    this.string = (light = 1) => rot.Color.toRGB(this.rgb(light))
}