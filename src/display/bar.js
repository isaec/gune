const { mod } = require("rot-js/lib/util");

const HC = require("/src/display/color").Html

class Bar {
    constructor(id, current, max, textColor, barColor, emptyColor, label) {
        this.id = id
        this.value = current
        this.max = max
        this.textColor = textColor
        this.barColor = barColor
        this.emptyColor = emptyColor
        this.label = label
        this.pre = document.querySelector(this.id)
        if (this.pre === null) throw `invalid id ${this.id}`
        window.addEventListener("resize", this.safeUpdate.bind(this))
        this.safeUpdate()
    }
    get nonBarLength(){
        return 7 + this.label.length
    }
    makeBar(maxLength = this.max) {
        let filled = "", empty = "", value = (this.value / this.max) * maxLength
        for (let i = 0; i < maxLength; i++) {
            if (value > i) filled += "*"
            else empty += "*"
        }
        return HC(filled, this.barColor) + HC(empty, this.emptyColor)
    }
    safeUpdate() {
        window.setTimeout(this._update.bind(this), 100)
    }
    _update() {
        let style = window.getComputedStyle(this.pre)
        let width = parseFloat(style.getPropertyValue("width"))
        let fontSize = parseFloat(style.getPropertyValue("font-size"))
        let charAmount = Math.floor(width / (fontSize / 1.6))

        this.pre.innerHTML = `${HC("[", this.textColor)
            }${this.makeBar(charAmount - this.nonBarLength)
            }${HC(`] ${Math.round((this.value / this.max) * 100)}% ${this.label}`, this.textColor)}`
    }

}

module.exports = Bar