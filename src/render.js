const rot = require("rot-js")
const { Color } = require("./color")
const entityTypes = require("/server/entity").Type
const FArray = require("/shared/array").FArray

module.exports.Screen = function (display, uuid, worldWidth, worldHeight) {
    this.display = display
    this.width = this.display._options.width
    this.height = this.display._options.height
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
    this.uuid = uuid
    this.entityGlyph = function (entityType) {
        const visuals = {
            [entityTypes.player]: { ch: '@', fg: new Color(5, 5, 2) },
            [entityTypes.devil]: { ch: '&', fg: new Color(3, 0, 1) },
            [entityTypes.imp]: { ch: 'i', fg: new Color(5, 1, 0) },
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

    this.mapGlyph = {
        0: { //unknown
            ch: "?",
            fg: new Color(2, 2, 2),
            bg: new Color(0, 0, 0)
        },
        undefined: { //out of bounds
            ch: " ",
            fg: new Color(0, 0, 0),
            bg: new Color(0, 0, 0)
        },
        1: { //floor
            ch: ".",
            fg: new Color(4, 3, 3),
            bg: new Color(3, 2, 2)
        },
        2: { //wall
            ch: "#",
            fg: new Color(4, 2, 2),
            bg: new Color(3, 1, 1)
        }
    }

    //values from 0.0 to 1.0
    this.lightMap = new FArray(worldWidth)
    //values of [char, fg, and optional bg]
    this.glyphMap = new FArray(worldWidth)


    this.render = function (world) {
        this.display.clear() //clear screen

        //clear arrays
        this.lightMap.clean()
        this.glyphMap.clean()


        const map = world.map
        let seenMap = world.seenMap.tiles

        const player = this.getPlayer(world)
        if (player === null) return //dont render if the world doesnt have the player in it

        //calculate light levels and such
        //NOTE this should be verified serverside later
        //should also not remake the object every render
        let fov = new rot.FOV.PreciseShadowcasting(
            (x, y) => (x < map.width && x > -1) && (y < map.height && y > -1)
                ? map.tiles[y][x] === 1 : false
        )


        //const player = this.getPlayer(world)
        for (const entity of world.entities) {
            if (entity.type !== "player") continue
            fov.compute(entity.x, entity.y, 10, (x, y, r, visibility) => {
                if (!seenMap.get(x, y)) seenMap.set(x, y, visibility > 0.0)
                if (this.lightMap.get(x, y) < visibility ||
                    this.lightMap.get(x, y) == undefined) {

                    this.lightMap.set(x, y, visibility)
                }
            })
        }

        for (let entity of world.entities.values()) {
            this.glyphMap.set(entity.x, entity.y, this.entityGlyph(entity.type))
        }


        //draw the world
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {

                const adjX = player.x + x - Math.floor(this.width / 2),
                    adjY = player.y + y - Math.floor(this.height / 2)


                //this is a very poor fix
                if ((adjX > map.width || adjX < 0)
                    ||
                    (adjY > map.height || adjY < 0)) { continue }

                const cordLight = this.lightMap.get(adjX, adjY)
                const lit = cordLight > 0.0

                const cordTile = this.mapGlyph[seenMap.get(adjX, adjY) ? map.tiles[adjY][adjX] : 0]

                let ch = cordTile.ch,
                    fg = cordTile.fg.truestring(cordLight),
                    bg = cordTile.bg.truestring(cordLight),
                    glyph = this.glyphMap.get(adjX, adjY)

                if (glyph && lit) {
                    ch = glyph.ch
                    fg = glyph.fg.truestring(cordLight)
                    bg = glyph.bg || bg
                }

                display.draw(x, y, ch, fg, bg)
            }
        }
    }
}