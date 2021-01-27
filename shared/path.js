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


module.exports.Dij = function(map, goalX, goalY) {
    let values = new FArray(map.width)
    values.set(goalX,goalY,0)
    for(let x = 0; x < map.width; x++){
        for(let y = 0; y < map.height; y++){
            console.log(map.tiles.get(x,y))
        }
    }
} 