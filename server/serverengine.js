const wrld = require("../server/world")

class Engine {
    constructor(){
        this.world = new wrld.World(100, 100)
    }
}

module.exports.Engine = Engine