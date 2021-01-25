module.exports.FArray = function (width) {
    this.width = width
    this._data = []
    this.get = (x, y) => this._data[x * width + y]
    this.set = (x, y, value) => this._data[x * width + y] = value
    this.clean = () => this._data = []
}