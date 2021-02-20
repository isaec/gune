const rot = require("rot-js")
const { Color } = require("./color")
const entityTypes = require("/shared/entity").Type
const FArray = require("/shared/array").FArray

module.exports.Screen = function (engine) {
    this.engine = engine
    this.width = this.engine.display._options.width
    this.height = this.engine.display._options.height


    this.scaleDisplay = () => this.engine.display.setOptions({ fontSize: Math.floor((window.innerHeight - 10) / 35) })
    window.addEventListener("resize", this.scaleDisplay)
    this.scaleDisplay()


    this.entityGlyph = function (entityType) {
        const visuals = {
            [entityTypes.player]: { ch: '@', fg: new Color(5, 5, 2) },
            [entityTypes.devil]: { ch: '&', fg: new Color(3, 0, 1) },
            [entityTypes.imp]: { ch: 'i', fg: new Color(5, 1, 0) },
        }

        return visuals[entityType]
    }

    this.getPlayer = (world) => {
        for (const entity of world.entities) {
            if (entity.id === this.engine.uuid) {
                this.player = entity
                return entity
            }
        }
        return null
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
        },
        3: { //red bloody floor
            ch: ".",
            fg: new Color(4, 2, 2),
            bg: new Color(2, 1, 1)
        },
        4: { //blue bloody floor
            ch: ".",
            fg: new Color(2, 2, 4),
            bg: new Color(1, 1, 2)
        },
        5: { //purple bloody floor
            ch: ".",
            fg: new Color(4, 2, 4),
            bg: new Color(2, 1, 2)
        }
    }

    //values from 0.0 to 1.0
    this.lightMap = new FArray(this.engine.world.map.width)
    //values of [char, fg, and optional bg]
    this.glyphMap = new FArray(this.engine.world.map.width)


    this.render = function (world) {
        this.engine.display.clear() //clear screen

        //clear arrays
        this.lightMap.clean()
        this.glyphMap.clean()

        const map = this.engine.world.map
        let seenMap = this.engine.world.seenMap.tiles

        const player = this.getPlayer(this.engine.world)
        if (player === null) console.log("woah")//return //dont render if the world doesnt have the player in it

        //calculate light levels and such
        //NOTE this should be verified serverside later
        //should also not remake the object every render
        let fov = new rot.FOV.PreciseShadowcasting(
            (x, y) => map.tiles.get(x, y) !== 2
        )


        for (const entity of this.engine.world.entities) {
            if (entity.type !== entityTypes.player) continue
            fov.compute(entity.x, entity.y, 10, (x, y, r, visibility) => {
                seenMap.set(x, y, true)
                if (this.lightMap.get(x, y) < visibility ||
                    this.lightMap.get(x, y) == undefined) {

                    this.lightMap.set(x, y, visibility)
                }
            })
        }

        for (let entity of this.engine.world.entities.values()) {
            this.glyphMap.set(entity.x, entity.y, this.entityGlyph(entity.type))
        }


        //draw the world
        for (let y = 0, adjY = player.y - Math.floor(this.height / 2); y < this.height; y++, adjY++) {
            for (let x = 0, adjX = player.x - Math.floor(this.width / 2); x < this.width; x++, adjX++) {

                //this is a very poor fix
                if ((adjX > map.width || adjX < 0)
                    ||
                    (adjY > map.height || adjY < 0)) { continue }

                const cordLight = this.lightMap.get(adjX, adjY),

                    cordTile = this.mapGlyph[
                        seenMap.get(adjX, adjY) ?
                            map.tiles.get(adjX, adjY) : 0
                    ],

                    glyph = this.glyphMap.get(adjX, adjY)

                let ch, fg, bg

                if (!(glyph && cordLight > 0.0)) {
                    ch = cordTile.ch
                    fg = cordTile.fg.truestring(cordLight)
                    bg = cordTile.bg.truestring(cordLight)
                } else {
                    ch = glyph.ch
                    fg = glyph.fg.truestring(cordLight)
                    bg = (glyph.bg || cordTile.bg).truestring(cordLight)
                }

                this.engine.display.draw(x, y, ch, fg, bg)
            }
        }
    }
}