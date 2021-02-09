const World = require("../server/world")

class Engine {
    constructor(){
        this.world = new World(100, 100)
    }
}

module.exports.Engine = Engine