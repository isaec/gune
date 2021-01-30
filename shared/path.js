//I want to make this in wasm at some point, its gonna be pricy to run I imagine
//can't know till i write it and perf test it =P
const FArray = require("../shared/array").FArray

/*
http://www.roguebasin.com/index.php?title=The_Incredible_Power_of_Dijkstra_Maps

To get a Dijkstra map, you start with an integer array representing your map, 
with some set of goal cells set to zero and all the rest set to a very high 
number. Iterate through the map's "floor" cells -- skip the impassable wall 
cells. If any floor tile has a value greater than 1 regarding to its lowest-
value floor neighbour (in a cardinal direction - i.e. up, down, left or right; 
a cell next to the one we are checking), set it to be exactly 1 greater than 
its lowest value neighbor. Repeat until no changes are made. The resulting grid 
of numbers represents the number of steps that it will take to get from any 
given tile to the nearest goal.

*/

function* neighbor(x, y) {
    yield new Cord(x, y + -1)
    yield new Cord(x, y + 1)
    yield new Cord(x + 1, y)
    yield new Cord(x + -1, y)

    yield new Cord(x + -1, y + -1)
    yield new Cord(x + -1, y + 1)
    yield new Cord(x + 1, y + -1)
    yield new Cord(x + 1, y + 1)
}

function* emptyNeighbor(x, y, occCallback) {
    for (const cord of neighbor(x, y)) {
        if (!occCallback(cord.x, cord.y)) yield cord
    }
}

/** 
 * returns a map of distances from goals
 * goalArray expects objects with x and y properites
*/
module.exports.Dij = function (map, goalArray, maxDistance = 20) {
    let distance = new FArray(map.width)
    let frontier = []
    for (const goal of goalArray) {
        frontier.push(new Cord(goal.x, goal.y))
        distance.set(goal.x, goal.y, 0)
    }


    while (frontier.length > 0) {
        let newFrontier = []
        for (let i = 0; i < frontier.length; i++) {
            let curr = frontier[i]
            for (let cord of neighbor(curr.x, curr.y)) {
                if (map.tiles.get(cord.x, cord.y) != 1) continue
                if (distance.get(cord.x, cord.y) == undefined) {
                    newFrontier.push(cord)
                    if (distance.set(cord.x, cord.y, distance.get(curr.x, curr.y) + 1) > maxDistance) return distance
                }

            }
        }
        frontier = newFrontier
    }
    return distance
}

module.exports.rollDown = (dij, fromCord, occCallback) => {
    let lowest = fromCord
    let lowestVal = dij.get(fromCord.x, fromCord.y)
    for (let cord of emptyNeighbor(fromCord.x, fromCord.y, occCallback)) {
        const val = dij.get(cord.x, cord.y)
        if (val < lowestVal) {
            lowest = cord
            lowestVal = val
        }
    }
    if (lowest === fromCord) console.log("rolling nowhere")
    return new Cord(lowest.x - fromCord.x, lowest.y - fromCord.y)
}


class Cord {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
} //didnt know i could do this
module.exports.Cord = Cord