import * as rot from "rot-js"

const constants = {
    MAP_WIDTH: 80,
    MAP_HEIGHT: 45
}

class Engine {
    constructor() {
        //make a rot.js canvas, and make it a property
        this.mapDisplay = new rot.Display({
            width: constants.MAP_WIDTH,
            height: constants.MAP_HEIGHT,
            fontFamily: "metrickal"
        })
        document.body.appendChild(this.mapDisplay.getContainer())

        for(let x = 0; x < 25; x++){
            for(let y = 0; y < 25; y++){
                this.mapDisplay.draw(x,y,String.fromCharCode(60+x+y))
            }
        }
    }
}


window.addEventListener("DOMContentLoaded", () => {
    const engine = new Engine()
    window.ENGINE = engine
})