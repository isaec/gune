const rot = require("rot-js")
const { Color } = require("./color")
const color = require("/src/color")

module.exports.Screen = function (display, uuid) {
    this.display = display
    this.width = this.display._options.width
    this.height = this.display._options.height
    this.uuid = uuid
    this.entityGlyph = function (entityType) {
        const visuals = {
            player: { ch: '@', fg: new Color(5, 5, 2) },
            troll: { ch: 'T', fg: new Color(2, 5, 2) },
            orc: { ch: 'o', fg: new Color(3, 5, 3) },
        }

        return visuals[entityType]
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

        const player = this.getPlayer(world)

        //calculate light levels and such
        //NOTE this should be verified serverside later
        //should also not remake the object every render
        let fov = new rot.FOV.PreciseShadowcasting((x, y) => {
            if (//make sure not to test cords out of bounds
                (x > map.width || x < 0)
                ||
                (y > map.height || y < 0)
            ) return false
            return world.map.tiles[y][x] === 0
        })

        //values from 0.0 to 1.0
        let lightMap = Array.from({ length: map.width }, () => [])
        //const player = this.getPlayer(world)
        for (const entity of world.entities) {
            fov.compute(entity.x, entity.y, 10, (x, y, r, visibility) => {
                if (lightMap[y][x] < visibility ||
                    lightMap[y][x] == undefined) {

                    lightMap[y][x] = visibility
                }
            })
        }

        //values of [char, fg, and optional bg]
        let glyphMap = Array.from({ length: map.width }, () => [])
        for (let entity of world.entities.values()) {
            glyphMap[entity.y][entity.x] = this.entityGlyph(entity.type)
        }


        const mapGlyph = {
            [false]: { //floor
                ch: ".",
                fg: new Color(4, 3, 3),
                bg: new Color(3, 2, 2)
            },
            [true]: { //wall
                ch: "#",
                fg: new Color(4, 2, 2),
                bg: new Color(3, 1, 1)
            }
        }

        //draw the world
        console.log()
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {

                const adjX = player.x + x - Math.floor(this.width/2),
                    adjY = player.y + y - Math.floor(this.height/2)


                //this is a very poor fix
                if((adjX > map.width || adjX < 0)
                ||
                (adjY > map.height || adjY < 0)){continue}

                const cordLight = lightMap[adjY][adjX]
                const lit = cordLight > 0.0,
                    wall = map.tiles[adjY][adjX] !== 0

                const cordTile = mapGlyph[wall]


                let ch = " ",
                    fg = cordTile.fg.truestring(cordLight),
                    bg = cordTile.bg.truestring(cordLight),
                    glyph = glyphMap[adjY][adjX]

                if (glyph) {
                    ch = lit ? glyph.ch : ch
                    fg = glyph.fg.truestring(cordLight)
                    bg = glyph.bg || bg
                } else {
                    ch = cordTile.ch
                }

                display.draw(x, y, ch, fg, bg)
            }
        }




    }
}