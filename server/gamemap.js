const rot = require("rot-js")
const FArray = require("../shared/array").FArray
module.exports.Map = function (width = 60, height = 35) {
    this.width = width
    this.height = height
    //makes a new array of the width and hight
    this.tiles = new FArray(width)


    this.digger = new rot.Map.Digger(width, height, {
        //dugPercentage: 5
    })
    this.digger.create((y, x, content) => this.tiles.set(x, y, content+1))
}