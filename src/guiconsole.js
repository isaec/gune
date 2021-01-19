module.exports.GuiConsole = function () {
    this.maxLines = 11
    this.messages = document.querySelector("#console")

    this.print = (message) => {
        let lines = this.messages.textContent.split("\n")
        lines.push(message)
        while (lines.length > this.maxLines) lines.shift()
        this.messages.textContent = lines.join("\n")
    }
}