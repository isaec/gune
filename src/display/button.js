const rgbstring = require("/src/display/color").rgbstring

class Button {
    constructor(id, text, hoverColor, clickColor) {
        this.id = id
        this._text = text
        this.hoverColor = hoverColor
        this.clickColor = clickColor
        this.button = document.querySelector(this.id)
        if (this.button === null) throw `invalid id ${this.id}`
        this._boundUpdate = this._update.bind(this)
        this.update()
        this.button.style.backgroundColor = rgbstring(this.hoverColor)
        // window.requestAnimationFrame(
        //     (() => {
        //         if (this.hoverColor) this.button.style.backgroundColor = rgbstring(this.hoverColor)
        //     }).bind(this)
        // )
    }
    _update() {
        this.button.innerHTML = this._text
    }
    update() {
        window.requestAnimationFrame(this._boundUpdate)
    }
}

module.exports = Button