const rgbstring = require("/src/display/color").rgbstring

class Button {
    constructor(id, text) {
        this.id = id
        this._text = text
        this.button = document.querySelector(this.id)
        if (this.button === null) throw `invalid id ${this.id}`
        this._boundUpdate = this._update.bind(this)
        this.update()
    }
    set text(text) {
        if (this._text !== text) {
            this._text = text
            this._update()
        }
    }
    get text() { return this._text }
    _update() {
        this.button.innerHTML = this._text
    }
    update() {
        window.requestAnimationFrame(this._boundUpdate)
    }
}

module.exports = Button