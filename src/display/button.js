class Button {
    constructor(id, text, clickHandler) {
        this.id = id
        this._text = text
        this.button = document.querySelector(this.id)
        if (this.button === null) throw `invalid id ${this.id}`
        if (clickHandler) {
            this.button.addEventListener("click", clickHandler)
        }
        this._boundUpdate = this._update.bind(this)
        this._boundDisable = this._disable.bind(this)
        this._boundEnable = this._enable.bind(this)
        this.update()
    }
    set text(text) {
        if (this._text !== text) {
            this._text = text
            this._update()
        }
    }
    get text() { return this._text }
    get disabled() {
        return this.button.disabled
    }
    set disabled(bool) {
        window.requestAnimationFrame(bool ? this._boundDisable : this._boundEnable)
    }

    _disable() {
        this.button.disabled = true
    }
    _enable() {
        this.button.disabled = false
    }

    _update() {
        this.button.innerHTML = this._text
    }
    update() {
        window.requestAnimationFrame(this._boundUpdate)
    }
}

module.exports = Button