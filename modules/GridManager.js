import { CONFIG } from "./CONFIG.js";

export class GridManager {
  minefield = document.getElementById("minefield");
  
  constructor(cellManager) {
    this.cellManager = cellManager;
    this.initializeGame();
    
    // Listen for reset events
    document.addEventListener('resetGame', () => {
      this.initializeGame();
    });
  }

  initializeGame() {
    this.cellManager.initializing = true;
    this.createGrid();
    this.placeMines();
    this.cellManager.initializeGame();
    this.openRandomEmptyCell();
    this.cellManager.initializing = false;
  }

  createGrid() {
    Object.assign(this.minefield.style, {
      gridTemplateColumns: `repeat(${CONFIG.CELLSACROSS}, var(--cell-size))`,
      gridTemplateRows: `repeat(${CONFIG.CELLSDOWN}, var(--cell-size))`
    });
    
    this.minefield.replaceChildren(
      ...Array.from({ length: CONFIG.CELLSACROSS * CONFIG.CELLSDOWN }, (_, i) => 
        this.cellManager.createCell(i)
      )
    );
  }

  placeMines() {
    const allCells = Array.from(this.cellManager.emptyCells);
    
    Array.from({ length: CONFIG.MINES }, () => {
      const randomIndex = Math.floor(Math.random() * allCells.length);
      const cell = allCells.splice(randomIndex, 1)[0];
      this.cellManager.addMine(cell);
    });
  }

  openRandomEmptyCell() {
    // Find all cells that are not mines and have zero adjacent mines
    const emptyCellsWithZeroMines = Array.from(this.cellManager.emptyCells).filter(cell => {
      const adjacentMines = this.cellManager.countAdjacentMines(cell.index);
      return adjacentMines === 0;
    });

    // If we have cells with zero adjacent mines, pick one randomly
    if (emptyCellsWithZeroMines.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCellsWithZeroMines.length);
      const randomCell = emptyCellsWithZeroMines[randomIndex];
      this.cellManager.openCell(randomCell);
    } else {
      // Fallback: if no cells have zero mines, just pick any empty cell
      const allEmptyCells = Array.from(this.cellManager.emptyCells);
      if (allEmptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * allEmptyCells.length);
        const randomCell = allEmptyCells[randomIndex];
        this.cellManager.openCell(randomCell);
      }
    }
  }
}
