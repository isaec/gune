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
    yield new Cord(x + -1, y + -1)
    yield new Cord(x + -1, y + 0)
    yield new Cord(x + -1, y + 1)
    yield new Cord(x + 0, y + -1)
    yield new Cord(x + 0, y + 0)
    yield new Cord(x + 0, y + 1)
    yield new Cord(x + 1, y + -1)
    yield new Cord(x + 1, y + 0)
    yield new Cord(x + 1, y + 1)
    //made from below
    // for(let xMod = -1; xMod <= 1; xMod++){
    //     for(let yMod = -1; yMod <= 1; yMod++){
    //         console.log(`yield new Cord(x + ${xMod}, y + ${yMod})`)
    //     }
    // }
}


module.exports.Dij = function (map, goalX, goalY) {
    console.time("dij")
    let distance = new FArray(map.width)
    let frontier = []
    frontier.push(new Cord(goalX, goalY))
    distance.set(goalX, goalY, 0)

    while (frontier.length > 0) {
        let curr = frontier[0]
        for (let cord of neighbor(curr.x, curr.y)) {
            if(map.tiles.get(cord.x,cord.y) != 1) continue
            if (distance.get(cord.x, cord.y) == undefined) {
                frontier.push(cord)
                distance.set(cord.x, cord.y, distance.get(curr.x, curr.y)+1)
            }
            
        }
        frontier.shift()
    }
    console.timeEnd("dij")
    return distance
}

class Cord {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
