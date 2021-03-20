const aiType = require("@project/shared/aiType.js")
const ai = require("./ai")

class aiEngine{
    constructor(engine){
        this.engine = engine
        this._ai = {
            [aiType.rush]: new ai()
        }
    }
}

module.exports = aiEngine