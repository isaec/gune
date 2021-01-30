const render = require("/src/display/render")
const guiconsole = require("/src/display/guiconsole")
const clientworld = require("/src/data/clientworld")
const key = require("/src/input/key")
const mouse = require("/src/input/mouse")
const rot = require("rot-js")

module.exports.Engine = function (connection) {
    this.connection = connection
    this.display = new rot.Display({
        width: 35,
        height: 35,
        fontFamily: "metrickal, monospace",
        forceSquareRatio: true,
    })
    this.guiConsole = new guiconsole.GuiConsole()

    this.world = undefined
    this.uuid = undefined
    this.screen = undefined
    this._screenReady = () => this.world && this.uuid

    this._loaded = () => this.world && this.screen && this.uuid

    this.loadWorld = (world) => {
        if (this._loaded()) return //this is not the best solution
        this.world = new clientworld.ClientWorld(world)
        this.loadIfReady()
    }
    this.loadUuid = (uuid) => {
        this.uuid = uuid
        this.loadIfReady()
    }

    this.loadIfReady = () => {
        if (this._screenReady() && !this.screen) this.screen = new render.Screen(this)
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
}