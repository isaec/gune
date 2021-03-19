class Ai{
    constructor(aiEngine){
        this.aiEngine = aiEngine
    }
    action(entity){
        console.log(entity.aiType + " is not defined.")
    }
}

module.exports = Ai