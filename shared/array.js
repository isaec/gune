/**
 * A flat and fast object for storing multidimensional arrays
 */
module.exports.FArray = function (width, data = []) {
    if(!width) throw "need a width"
    this.width = width
    this._data = data
    this.get = (x, y) => this._data[x * width + y]
    this.getSafe = (x, y, fallback) => this.get(x, y) ? this.get(x, y) : fallback
    this.set = (x, y, value) => this._data[x * width + y] = value
    this.clean = () => this._data = []
}