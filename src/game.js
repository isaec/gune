const rot = require("rot-js")

// Check if rot.js can work on this browser
// if (!rot.isSupported()) {
//     alert("the rot.js library isn't supported by your browser. close the page, or many errors shall befall you.")
// }

console.log("i live")

// Create a display
let display = new rot.Display({width:60, height:30})
let container = display.getContainer()
// Add the container to our HTML page
document.body.appendChild(container)

//little demo to make sure all works
let foreground, background, colors
for (let x = 0; x <= 180; x++){
    for (let y = 0, ascii = x; y <= 80; y++, ascii+=2){
        foreground = rot.Color.toRGB([
            Math.max(0,Math.min(16,x))*Math.max(0,Math.min(128,y)),
            Math.max(0,Math.min(64,x))*Math.max(0,Math.min(64,y)),
            Math.max(0,Math.min(128,x))*Math.max(0,Math.min(16,y))])
        background = rot.Color.toRGB([
            Math.random()*Math.min(256,2*x),
            Math.random()*Math.min(256,3*y),
            Math.random()*Math.min(256,x+y)])
        colors = "%c{" + foreground + "}%b{" + background + "}"
        display.drawText(x,y,colors+String.fromCharCode(ascii),1)
}}