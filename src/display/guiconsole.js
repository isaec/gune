const HtmlColor = require("/src/display/color").Html

module.exports.GuiConsole = function () {
    this.maxLines = 100
    this.messages = document.querySelector("#console")

    //this.messages.textContent = "\n".repeat(this.maxLines)

    this.lines = []

    this.print = (ConsoleLine) => {


        if (this.lines.length > 0 &&
            this.lines[this.lines.length - 1].message === ConsoleLine.message &&
            this.lines[this.lines.length - 1].stack) {

            this.lines[this.lines.length - 1].amount++
        }
        else {
            this.lines.push(ConsoleLine)
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


module.exports.ConsoleLine = function (message, color = [5, 5, 5], temp = false, stack = true) {
    this.message = message
    this.temp = temp
    this.stack = stack
    this.amount = 1
    this.color = color
    this.bg = false


    this.toString = () => {
        return "<div>" + (this.amount > 1 ?
            HtmlColor(`(${this.amount}x) `, [3, 3, 3])
            + HtmlColor(this.message, this.color, this.bg)
            :
            HtmlColor(this.message, this.color, this.bg)) + "</div>"
    }
}