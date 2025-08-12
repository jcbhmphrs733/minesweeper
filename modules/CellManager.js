export class CellManager {

    constructor() {
        this.mines = null;
        this.flags = null;
        this.numbers = null;
        this.emptyCells = null;
        this.init()
    }

    init() {
        this.mines = new Set()
        this.flags = new Set()
        this.number = new Set()
        this.emptyCells = new Set()
    }

    
}