const rot = require("rot-js")

module.exports.Screen = function (display, uuid) {
    this.display = display
    this.uuid = uuid
    this.drawEntity = function (entity) {
        const visuals = {
            player: ['@', "hsl(60, 100%, 50%)"],
            troll: ['T', "hsl(120, 60%, 50%)"],
            orc: ['o', "hsl(100, 30%, 50%)"],
        }

        const [ch, fg, bg] = visuals[entity.type]

        this.display.draw(entity.x, entity.y, ch, fg, bg);
    }

    this.getPlayer = (world) => {
        return (() => {
            for (const entity of world.entities) {
                if (entity.id === this.uuid) {
                    this.player = entity
                    return entity
                }
            }
            return null
        })()
    }

    this.render = function (world) {
        this.display.clear() //clear screen

        const map = world.map
        
        //calculate light levels and such
        //NOTE this should be verified serverside later
        //should also not remake the object every render
        let fov = new rot.FOV.PreciseShadowcasting((x,y) => {
            if(
                (x > map.width || x < 0)
                ||
                (y > map.height || y < 0)
            ) return false
            return world.map.tiles[y][x] === 0
        })
        let lightMap = Array.from({length:map.width}, () => [])
        const player = this.getPlayer(world)
        if(player){
            fov.compute(player.x, player.y, 10, (x,y,r, visibility) => {
                lightMap[y][x] = visibility
            })
        }


        const colors = {
            [false]: {[false]: "rgb(50, 50, 150)", [true]: "rgb(0, 0, 100)"},
            [true]: {[false]: "rgb(200, 180, 50)", [true]: "rgb(130, 110, 50)"}
        }

        const visuals = {
            [true]: "#",
            [false]: "."
        }


        //draw the world
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const lit = lightMap[y][x] > 0.0,
                wall = map.tiles[y][x] !== 0
                const color = colors[lit][wall]
                const visual = visuals[wall]
                display.draw(x,y,visual,"black",color)
            }
        }

        //draw the entities
        for (const entity of world.entities) {
            this.drawEntity(entity)
        }
    }
}