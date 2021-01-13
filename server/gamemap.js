const nj = require("@theoxiong/numjs")
const rot = require("rot-js")

module.exports.Map = function (width = 60, height = 35) {
    this.width = width
    this.height = height
    //makes a new nj array of the width and hight
    //basically, zeros in desired shape
    this.tiles = nj.zeros([width, height])
    //not sure if these are a good idea?
    //meh ill do it until its an issue
    this.get = (x, y) => { return this.tiles.get(x, y) }
    this.set = (x, y, content) => { return this.tiles.set(x, y, content) }

    const digger = new rot.Map.Digger(width, height)
    digger.create((x, y, content) => this.set(x, y, content))
}