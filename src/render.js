module.exports.Screen = function (display) {
    this.display = display
    this.drawEntity = function (entity) {
        const visuals = {
            player: ['@', "hsl(60, 100%, 50%)"],
            troll: ['T', "hsl(120, 60%, 50%)"],
            orc: ['o', "hsl(100, 30%, 50%)"],
        }

        const [ch, fg, bg] = visuals[entity.type]

        this.display.draw(entity.x, entity.y, ch, fg, bg);
    }
    this.render = function (world) {
        this.display.clear() //clear screen

        //draw the world
        const map = world.map
        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {
                if (map.tiles[y][x]) {
                    display.draw(x, y, "#", "darkorange", "darkred")
                } else {
                    display.draw(x, y, ".", "crimson", "black")
                }
            }
        }

        //draw the entities
        for (const entity of world.entities) {
            this.drawEntity(entity)
        }
    }
}