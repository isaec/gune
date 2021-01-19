module.exports.GuiConsole = function () {
    this.maxLines = 11
    this.messages = document.querySelector("#console")

    this.messages.textContent = "\n".repeat(this.maxLines)

    this.lines = []

    this.print = (ConsoleLine) => {
        
        
            if(this.lines.length > 0 && this.lines[this.lines.length-1].message === ConsoleLine.message) {
                this.lines[this.lines.length-1].amount++
            }
        
        else {
            this.lines.push(ConsoleLine)
        }

        this._update()
    }

    // this.removeNewest = (message) => {
    //     const index = this.lines.indexOf(message)
    //     if (index > -1) this.lines.splice(index, 1)
    //     this._update()
    // }

    this._update = () => {
        if( //remove temp line if its been replaced
            this.lines.length > 2 && this.lines[this.lines.length-2].temp
        ) this.lines.splice(this.lines.length-2, 1)

        let displayLines = [...this.lines]
        while (displayLines.length > this.maxLines) displayLines.shift()
        this.messages.textContent = displayLines.join("\n")
    }
}


module.exports.ConsoleLine = function (message, temp=false) {

    this.message = message
    this.temp = temp
    this.amount = 1

    this.toString = () => { return this.amount>1 ? `(${this.amount}x) ${this.message}` : this.message }

}