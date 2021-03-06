class Button {
    constructor(id, text) {
        this.id = id
        this._text = text
        this.button = document.querySelector(this.id)
        if (this.button === null) throw `invalid id ${this.id}`
        this._boundUpdate = this._update.bind(this)
        this.update()
        window.requestAnimationFrame(
            (() => {

            }).bind(this)
        )
    }
    _update() {
        this.button.innerHTML = this._text
    }
    update() {
        window.requestAnimationFrame(this._boundUpdate)
    }
}

module.exports = Button