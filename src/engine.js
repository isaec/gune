const render = require("/src/display/render")
const guiconsole = require("/src/display/guiconsole")
const ClientWorld = require("/src/data/clientworld")
const key = require("/src/input/key")
const mouse = require("/src/input/mouse")
const sendAction = require("/src/input/sendaction")
const rot = require("rot-js")
const Bar = require("/src/display/bar")

module.exports.Engine = function (connection) {
    //this block can be initialized right away
    this.connection = connection
    this.display = new rot.Display({
        width: 35,
        height: 35,
        fontFamily: "metrickal, monospace",
        forceSquareRatio: true,
    })
    this.guiConsole = new guiconsole.GuiConsole()
    this.actionHandler = new sendAction.ActionHandler(this)


    //this block can't be loaded without help from the server
    this.world = undefined
    this.uuid = undefined

    this.screen = undefined
    this._screenReady = () => this.world && this.uuid

    this.levelBar = undefined
    this.healthBar = undefined
    this._barsReady = () => this.world && this.uuid
    //end block of objects that need help

    this._loaded = () => this.world && this.screen && this.uuid

    this.loadWorld = (world) => {
        if (this.world) return //this is not the best solution
        this.world = new ClientWorld(this, world)
        this.loadIfReady()
    }
    this.loadUuid = (uuid) => {
        this.uuid = uuid
        this.loadIfReady()
    }

    this.loadIfReady = () => {
        if (this._screenReady() && !this.screen) this.screen = new render.Screen(this)
        if (this._barsReady() && !(this.levelBar || this.healthBar)) {
            const player = this.getPlayer()
            this.healthBar = new Bar(
                "#health", player.hp, player.maxHp,
                [5, 4, 3], [4, 3, 2], [2, 1, 1],
                "hp"
            )
            this.levelBar = new Bar(
                "#level", 69, 100,
                [4, 3, 5], [2, 3, 5], [1, 1, 2],
                "xp"
            )
        }
    }


    //bind display
    const gameFigure = document.getElementById("game")
    gameFigure.appendChild(this.display.getContainer())

    //make the handlers
    this.keyHandler = new key.KeyHandler(this)
    this.mouseHandler = new mouse.MouseHandler(this)
    //bind the handlers

    window.addEventListener("keydown", this.keyHandler.keydown)
    window.addEventListener("keyup", this.keyHandler.keyup)
    window.addEventListener("blur", () => { this.keyHandler.pressed.clear() })
    const canvas = this.display.getContainer()
    canvas.addEventListener("click", this.mouseHandler.click)
    canvas.addEventListener("mousemove", this.mouseHandler.mousemove)
    canvas.addEventListener("mouseout", this.mouseHandler.mouseout)


    //functions
    this.player = undefined
    this.getPlayer = () => {
        if (this.player) return this.player
        for (const entity of this.world.entities) {
            if (entity.id === this.uuid) {
                this.player = entity
                return entity
            }
        }
        alert("this should not have happened.")
        return null
    }

}