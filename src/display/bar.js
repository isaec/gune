const { mod } = require("rot-js/lib/util");

const HC = require("/src/display/color").Html

class Bar {
    constructor(id, current, max, textColor, barColor, emptyColor, label) {
        this.id = id
        this._value = Math.max(Math.min(current, max), 0)
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
    get nonBarLength() {
        //6 is for brackets and % length
        return 6
            //the length of the label
            + this.label.length
            //the space for the label, if it exists
            + (this.label.length > 0 ? 1 : 0)
    }
    get value() { return this._value }
    set value(value) {
        this._value = Math.max(0, value)
        this._update()
    }
    makeBar(maxLength = this.max) {
        let filled = "", empty = "", value = (this._value / this.max) * maxLength
        for (let i = 0; i < maxLength; i++) {
            if (value > i) filled += "*"
            else empty += "*"
        }
        return HC(filled, this.barColor) + HC(empty, this.emptyColor)
    }
    makeLabel(barStr) {
        //opening bracket
        return `${HC("[", this.textColor)
            //the *s for the bar
            }${barStr
            //the number
            }${HC(`]${Math.round((this._value / this.max) * 100).toString().padStart(3, " ")
                //the % and label
                }% ${this.label
                }`, this.textColor)}`
    }
    safeUpdate() {
        window.setTimeout(this._update.bind(this), 100)
    }
    _update() {
        let style = window.getComputedStyle(this.pre)
        let width = parseFloat(style.getPropertyValue("width"))
        let fontSize = parseFloat(style.getPropertyValue("font-size"))
        let charAmount = Math.floor(width / (fontSize / 1.6))

        this.pre.innerHTML = this.makeLabel(
            this.makeBar(charAmount - this.nonBarLength)
        )
    }

}

module.exports = Bar