const rot = require("rot-js")

//takes values 0 to 3, and then scales them based on light levels
module.exports.Color = function (r, g, b) {
    this.r = r
    this.g = g
    this.b = b
    this.rgb = [r, g, b]
    this.rgb = (light = 1) => [
        (this.r * 85 * light),
        (this.g * 85 * light),
        (this.b * 85 * light)
    ]
    this.string = (light = 1) => rot.Color.toRGB(this.rgb(light))
}