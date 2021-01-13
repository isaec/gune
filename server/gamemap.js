const rot = require("rot-js")

module.exports.Map = function (width = 60, height = 35) {
    this.width = width
    this.height = height
    //makes a new array of the width and hight
    //basically, null in desired shape
    this.tiles = Array.from({length:width}, () => [])


    this.get = (x, y) => { return this.tiles[x][y] }
    this.set = (x, y, content) => { this.tiles[x][y] = content }

    const digger = new rot.Map.Digger(width, height)
    digger.create((y, x, content) => this.set(x, y, content))
}