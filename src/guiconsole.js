module.exports.GuiConsole = function (maxLines=5) {
    this.maxLines = maxLines
    this.messages = document.querySelector("#console")

    this.print = (message) => {
        let lines = this.messages.textContent.split("\n")
        lines.push(message)
        while (lines.length > this.maxLines) lines.shift()
        this.messages.textContent = lines.join("\n")
    }
}