import { CONFIG } from "./CONFIG.js";

export class GridManager {

    constructor(cellManager) {
        this.cellManager = null;
        this.minefield = null
        this.cells = null;
        this.cellsAcross = null;
        this.cellsDown = null;
        this.init(cellManager)
    }

    init(cellManager) {
        this.cellManager = cellManager;
        this.minefield = document.getElementById('minefield');
        this.cells = new Set();
        this.cellsAcross = CONFIG.CELLSACROSS
        this.cellsDown = CONFIG.CELLSDOWN
        this.cellSize = CONFIG.CELLSIZE
        this.createGrid();
    }

    createGrid() {
        this.minefield.style.gridTemplateColumns = `repeat(${this.cellsAcross},${this.cellSize}px)`
        this.minefield.style.gridTemplateRows = `repeat(${this.cellsDown},${this.cellSize}px)`

        this.minefield.innerHTML = "";
        this.cells.clear();

        for (let i = 0; i < this.cellsAcross * this.cellsDown; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.innerHTML = i;
            // Add event listeners here later



            this.minefield.appendChild(cell);
            this.cells.add(cell);
        }
    }
}