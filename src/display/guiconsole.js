const HtmlColor = require("/src/display/color").Html

module.exports.GuiConsole = function () {
    this.maxLines = 100
    this.messages = document.querySelector("#console")

    //this.messages.textContent = "\n".repeat(this.maxLines)

    this.lines = []

    this.print = (consoleLine) => {


        if (this.lines.length > 0 &&
            this.lines[this.lines.length - 1].message === consoleLine.message &&
            this.lines[this.lines.length - 1].stack) {

            this.lines[this.lines.length - 1].addAmount()
        }
        else {
            this.lines.push(consoleLine)
        }
        this._update()
    }

    this._update = () => {
        if ( //remove temp line if its been replaced
            this.lines.length > 2 && this.lines[this.lines.length - 2].temp
        ) this.lines.splice(this.lines.length - 2, 1)



        let displayLines = [...this.lines]
        while (displayLines.length > this.maxLines) displayLines.shift()
        displayLines.reverse()
        this.messages.innerHTML = displayLines.join("\n")

        //this.messages.scrollTop = this.messages.scrollHeight
    }
}

class ConsoleLine {
    constructor(message, color = [5, 5, 5], temp = false, stack = true) {
        this.message = message
        this.temp = temp
        this.stack = stack
        this.amount = 1
        this.color = color
        this.bg = false
        this.time = new Date()
    }

    get timeString() {
        return `${(this.time.getHours() % 12 || 12).toString().padStart(2, "0")
            }:${this.time.getMinutes().toString().padStart(2, "0")
            }`
    }

    addAmount() {
        this.amount++
        this.time = new Date()
    }

    toString() {
        return `<div>${HtmlColor(this.timeString, [1, 1, 1])} ${HtmlColor(this.message, this.color, this.bg)} ${(this.amount > 1 ?
            HtmlColor(`(${this.amount}x) `, [2, 2, 2]) : "")}</div>`
    }
}

module.exports.ConsoleLine = ConsoleLine