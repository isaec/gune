const rot = require("rot-js")

//takes values 0 to 5, and then scales them based on light levels
module.exports.Color = function (r, g, b) {
    this.r = r
    this.g = g
    this.b = b
    this.rgb = [r, g, b]
    this.greyscale = (mod = 1) => {

        const grey = Math.round(
            (0.3 * (this.r * (51 * mod))) +
            (0.59 * (this.g * (51 * mod))) +
            (0.11 * (this.b * (51 * mod))))

        return [grey, grey, grey]

    }
    this.rgb = (light = 1, floor = 10) => [
        (this.r * (((51 - floor) * light) + floor)), //5*51=255
        (this.g * (((51 - floor) * light) + floor)),
        (this.b * (((51 - floor) * light) + floor))
    ]
    this.string = (light = 1) => rot.Color.toRGB(this.rgb(light))
    this.greystring = (mod = 1) => rot.Color.toRGB(this.greyscale(mod))
    this.truestring = (light, mod = .15) => {
        if (light > 0.0) return this.string(light)
        return this.greystring(mod)
    }
}

//spaggetii but works gud
module.exports.Html = (text,color) => `<span style="color:rgb(${color[0]*51},${color[1]*51},${color[2]*51});">${text}</span>`