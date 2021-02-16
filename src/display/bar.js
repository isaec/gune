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
        this.node = document.querySelector(id)
        if(this.node === null) throw `invalid id ${id}`
        this._update()
    }
    makeBar() {
        let filled = "", empty = ""
        for (let i = 0; i < this.max; i++) {
            if (this.value > i) filled += "*"
            else empty += "*"
        }
        return HC(filled, this.barColor) + HC(empty, this.emptyColor)
    }
    _update() {
        this.node.innerHTML = `${HC("[", this.textColor)
            }${this.makeBar()
            }${HC(`] ${Math.round((this.value / this.max) * 100)}% ${this.label}`, this.textColor)}`
    }

}

module.exports = Bar