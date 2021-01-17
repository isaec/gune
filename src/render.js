const rot = require("rot-js")
const { Color } = require("./color")
const color = require("/src/color")

module.exports.Screen = function (display, uuid) {
    this.display = display
    this.uuid = uuid
    this.entityGlyph = function (entityType) {
        const visuals = {
            player: { ch: '@', fg: "hsl(60, 100%, 50%)" },
            troll: { ch: 'T', fg: "hsl(120, 60%, 50%)" },
            orc: { ch: 'o', fg: "hsl(100, 30%, 50%)" },
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

        //calculate light levels and such
        //NOTE this should be verified serverside later
        //should also not remake the object every render
        let fov = new rot.FOV.PreciseShadowcasting((x, y) => {
            if (
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
                lightMap[y][x] = visibility
            })
        }

        //values of [char, fg, and optional bg]
        let glyphMap = Array.from({ length: map.width }, () => [])
        for (let entity of world.entities.values()) {
            glyphMap[entity.y][entity.x] = this.entityGlyph(entity.type)
        }


        const mapColors = {
            //dark      floor                         wall
            [false]: { [false]: new Color(0, 0, 0), [true]: new Color(0, 0, 0) },
            //illuminated floor                      wall
            [true]: { [false]: new Color(4, 3, 3), [true]: new Color(2, 1, 1) }
        }

        const mapGlyphs = {
            [true]: "#",
            [false]: "."
        }


        //draw the world
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const cordLight = lightMap[y][x]
                const lit = cordLight > 0.0,
                    wall = map.tiles[y][x] !== 0


                let ch = " ",
                    fg = "black",
                    bg = mapColors[lit][wall].string(cordLight),
                    glyph = glyphMap[y][x]

                if (glyph) {
                    ch = lit ? glyph.ch : ch
                    fg = glyph.fg
                    bg = glyph.bg || bg
                } else {
                    ch = mapGlyphs[wall]
                }

                display.draw(x, y, ch, fg, bg)
            }
        }


    }
}