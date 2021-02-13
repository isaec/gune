const rot = require("rot-js")
const path = require("/shared/path")
const guiconsole = require("/src/display/guiconsole")
const FArray = require("/shared/array").FArray
const action = require("/shared/action")

module.exports.MouseHandler = function (engine) {
    this.engine = engine

    this.dij = undefined
    this.rate = 160

    this.eventParse = (event) => {
        const [x, y] = engine.display.eventToPosition(event)
        const player = engine.getPlayer()
        if (!player) return [x, y, undefined, undefined, undefined]
        return [x, y,
            player.x + x - Math.floor(this.engine.screen.width / 2),
            player.y + y - Math.floor(this.engine.screen.height / 2),
            player]
    }

    this.knownTile = (x, y) => this.engine.world.seenMap.tiles.get(x, y) ? this.engine.world.map.tiles.get(x, y) : 1

    this.click = (event) => {

        const [, , adjX, adjY, player] = this.eventParse(event)
        if (!player) return

        //this is basically a demo... its not well done and shouldnt hang around
        if (this.knownTile(adjX, adjY) !== 1) {
            this.engine.guiConsole.print(
                new guiconsole.ConsoleLine("that pathing goal is obstructed", [5, 3, 2], true)
            )
            return
        }


        this.dij = new path.Dij(this.engine.world.map.width, this.knownTile, [
            new path.Cord(adjX, adjY)
        ], 140)

        this.startInterval()

        event.preventDefault()

    }
    this.tooltipWrap = undefined

    this.mouseout = () => {
        if (this.tooltipWrap) {
            this.tooltipWrap.remove()
            this.tooltipWrap = undefined
        }
    }

    this.mousemove = (event) => {
        //jank lol
        // let oldTip = document.querySelector(".tooltip")
        // if (oldTip) oldTip.remove()

        const [x, y, adjX, adjY, ] = this.eventParse(event)

        let entity = this.engine.world.getEntityAtConditional(adjX, adjY, (xx, yy) => this.engine.screen.lightMap.get(xx, yy) > 0.0)

        if (!entity) {
            this.mouseout()
            return
        }

        if (!this.tooltipWrap) {
            this.tooltipWrap = document.createElement("div")
            this.tooltipWrap.className = "tooltip"
            this.tooltipWrap.appendChild(document.createTextNode(""))

            let firstChild = document.body.firstChild
            firstChild.parentNode.insertBefore(this.tooltipWrap, firstChild)
        }

        this.tooltipWrap.childNodes[0].nodeValue = entity.name ? `${entity.name}` : `${entity.type}`

        let tooltipProps = this.tooltipWrap.getBoundingClientRect()
        let frameProps = this.engine.display._backend._ctx.canvas.getBoundingClientRect()


        let toolX = (x * (frameProps.width / this.engine.screen.width)) + frameProps.left
        let toolY = (y * (frameProps.height / this.engine.screen.height)) + frameProps.top

        this.tooltipWrap.setAttribute("style", `top:${toolY - tooltipProps.height * 1.2}px; left:${toolX}px;`)
    }

    this.intervalFunc = () => {
        const player = engine.getPlayer()
        if (!player) return

        let moveCord = path.rollDown(this.dij.distance, new path.Cord(player.x, player.y), this.engine.world.entityAt)
        if (!moveCord) {
            this.stopInterval()
        } else {
            if (!this.engine.actionHandler.handle(
                new action.Move(moveCord.x, moveCord.y)
            )) {
                let target = this.dij.goalArray[0]
                if (this.knownTile(target.x, target.y) !== 1) {
                    this.engine.guiConsole.print(
                        new guiconsole.ConsoleLine("that pathing goal has been revealed to be obstructed", [3, 1, 2], true)
                    )
                    this.stopInterval()
                }
                this.dij.calc()
            }
        }
    }
    this.interval = false

    this.stopInterval = () => { if (this.interval) clearInterval(this.interval) }

    this.startInterval = () => {
        this.stopInterval()
        this.interval = setInterval(this.intervalFunc, this.rate)
    }
}