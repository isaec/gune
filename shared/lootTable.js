class lootTable {
    constructor(lootArray) {
        this.lootArray = lootArray
        this.totalWeight = 0
        for (let [index, [, weight]] of this.lootArray.entries()) {
            this.lootArray[index][1] = new Range(this.totalWeight, this.totalWeight += weight)
        }
    }
    get elem() {
        const rNum = Math.floor(Math.random() * this.totalWeight)
        for(let [loot, range] of this.lootArray) {
            if(range.contains(rNum)) return loot
        }
    }
}

class Range {
    constructor(start, end) {
        this.start = start
        this.end = end
    }
    contains(number) {
        return (this.start <= number) && (number < this.end)
    }
}

module.exports = lootTable