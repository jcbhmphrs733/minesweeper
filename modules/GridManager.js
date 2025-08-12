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
    }

    placeMines() {
        const mineCount = CONFIG.MINES;
        const allCells = Array.from(this.cellManager.emptyCells);

        for (let i = 0; i < mineCount; i++) {
            const randomIndex = Math.floor(Math.random() * allCells.length);
            const cell = allCells[randomIndex];
            this.cellManager.addMine(cell);
            allCells.splice(randomIndex, 1);
            this.cellManager.emptyCells.delete(cell)
        }
    }

    placeNumbers() {
        this.cellManager.emptyCells.forEach(cell => {
            const index = parseInt(cell.dataset.index);
            const adjacentMines = this.getAdjacentMines(CONFIG.CELLSACROSS, CONFIG.CELLSDOWN, index);
            cell.innerHTML = adjacentMines > 0 ? adjacentMines : "";
        });
    }

    getAdjacentMines(cols, rows, index) {
        let mineCount = 0;
        const neighbors = []
        //neighbor checking logic
        const row = Math.floor(index / cols);
        const col = index % cols;

        for (let dRow = -1; dRow <= 1; dRow++) {
            for (let dCol = -1; dCol <= 1; dCol++) {
                if (dRow === 0 && dCol === 0) continue; // skip self

                const newRow = row + dRow;
                const newCol = col + dCol;

                // check boundaries and add valid neighbors
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    neighbors.push(newRow * cols + newCol)
                }
            }
        }
        neighbors.forEach(index => {
            let mines = this.cellManager.getMineIndexes().map(Number)
            if (mines.includes(index)) {
                mineCount += 1
            }
        })
        return mineCount;
    }


}