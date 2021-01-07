import * as rot from "rot-js"



const display = new rot.Display({
    width: 60, 
    height: 35,
    fontSize:20,
    fontFamily:"metrickal, monospace",
    forceSquareRatio:true,
    })

const gameFigure = document.getElementById("gameFigure")
gameFigure.appendChild(display.getContainer())

const canvas = display.getContainer()
canvas.addEventListener('keydown', handleKeyDown)
canvas.setAttribute('tabindex', "1")
canvas.focus()

let entities = new Map();
function createEntity(type, x, y) {
    let id = ++createEntity.id;
    let entity = { id, type, x, y };
    entities.set(id, entity);
    return entity;
}
createEntity.id = 0;

let player = createEntity('player', 5, 4);


function handleKeys(keyCode) {
    const actions = {
        [rot.KEYS.VK_RIGHT]: () => ['move', +1, 0],
        [rot.KEYS.VK_LEFT]:  () => ['move', -1, 0],
        [rot.KEYS.VK_DOWN]:  () => ['move', 0, +1],
        [rot.KEYS.VK_UP]:    () => ['move', 0, -1],
    };
    let action = actions[keyCode];
    return action ? action() : undefined;
}

function handleKeyDown(event) {
    console.log(event)
    let action = handleKeys(event.keyCode);
    if (action) {
        if (action[0] === 'move') {
            let [_, dx, dy] = action;
            player.x += dx;
            player.y += dy;
            draw();
        } else {
            throw `unhandled action ${action}`;
        }
        event.preventDefault();
    }
}

function drawEntity(entity) {
    const visuals = {
        player: ['@', "hsl(60, 100%, 50%)"],
        troll: ['T', "hsl(120, 60%, 50%)"],
        orc: ['o', "hsl(100, 30%, 50%)"],
    };

    const [ch, fg, bg] = visuals[entity.type];
    display.draw(entity.x, entity.y, ch, fg, bg);
}

function draw() {
    display.clear();
    for (let entity of entities.values()) {
        drawEntity(entity);
    }
}