import { CONFIG } from "./CONFIG.js";

export class GridManager {

    constructor(cellManager) {
        this.cellManager = null;
        this.minefield = null
        this.cellsAcross = null;
        this.cellsDown = null;
        this.init(cellManager)
    }

    init(cellManager) {
        this.cellManager = cellManager;
        this.minefield = document.getElementById('minefield');
        this.createGrid();
        this.placeMines();
        this.placeNumbers();
    }

    createGrid() {
        this.minefield.style.gridTemplateColumns = `repeat(${CONFIG.CELLSACROSS},${CONFIG.CELLSIZE}px)`
        this.minefield.style.gridTemplateRows = `repeat(${CONFIG.CELLSDOWN},${CONFIG.CELLSIZE}px)`

        this.minefield.innerHTML = "";

        for (let i = 0; i < CONFIG.CELLSACROSS * CONFIG.CELLSDOWN; i++) {
            const cell = this.cellManager.createCell(i);
            this.minefield.appendChild(cell);
        }

        console.log(this.cellManager.emptyCells);
    }

    placeMines() {
        const mineCount = CONFIG.MINES;
        const allCells = Array.from(this.cellManager.emptyCells);

        for (let i = 0; i < mineCount; i++) {
            const randomIndex = Math.floor(Math.random() * allCells.length);
            const cell = allCells[randomIndex];
            this.cellManager.addMine(cell);
            allCells.splice(randomIndex, 1);
        }
    }

    placeNumbers() {
        this.cellManager.emptyCells.forEach(cell => {
            const index = parseInt(cell.dataset.index);
            const adjacentMines = this.getAdjacentMines(index);
            cell.innerHTML = adjacentMines > 0 ? adjacentMines : "";
        });
    }

    getAdjacentMines(index) {
        let mineCount = 0;
        //neighbor checking logic

        return mineCount;
    }
}