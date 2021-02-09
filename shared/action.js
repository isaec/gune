
class Action {
    constructor(type){
        this.type = type
    }
    validate() {
        console.log(`action of type ${this.type} with data ${this.data} has no validate function`)
        return true
    }
}


class Move extends Action {
    constructor(changeX, changeY){
        super("move")
        this.changeX = changeX
        this.changeY = changeY
        this.data = [changeX, changeY] //to maintain support for old code
    }
}

module.exports.Move = Move