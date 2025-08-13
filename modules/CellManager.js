import { CONFIG } from "./CONFIG.js";

export class CellManager {
  constructor() {
    this.mines = null;
    this.emptyCells = null;
    this.flags = null;
    this.init();
  }

  init() {
    this.mines = new Set();
    this.emptyCells = new Set();
    this.flags = new Set();
  }

  createCell(index) {
    const cell = document.createElement("div");

    document.addEventListener("click", (event) => {
      // left click
      if (event.target === cell && event.button === 0) {
        this.open(cell);
      }
    });
    document.addEventListener("contextmenu", (event) => {
      // right click
      if (event.target === cell && event.button === 2) {
        this.flag(cell);
      }
    });
    cell.classList.add("cell", "cell-closed");
    this.emptyCells.add(cell);
    cell.dataset.index = index;
    return cell;
  }

  addMine(cell) {
    cell.classList.add("mine");
    this.mines.add(cell);
    this.emptyCells.delete(cell);
  }

  open(cell) {
    if (this.mines.has(cell)) {
      // Handle mine opening
      console.log("you opened a mine");
      cell.classList.remove("cell-closed");
      cell.classList.add("cell-opened");
      this.mines.forEach((mine) => {
        mine.style.backgroundImage = "url('./assets/images/mine.png')";
      });
      this.emptyCells.forEach((numberCell) => {
        numberCell.classList.remove("cell-closed");
        numberCell.classList.add("cell-opened");
        this.placeNumber(numberCell);
      });
    } else {
      // Handle safe cell opening
      console.log("you opened a safe cell");
      cell.classList.remove("cell-closed");
      cell.classList.add("cell-opened");
      this.placeNumber(cell);
    }
  }

  flag(cell) {
    if (this.flags.has(cell)) {
      cell.classList.remove("flagged");
      this.flags.delete(cell);
    } else {
      cell.classList.add("flagged");
      this.flags.add(cell);
    }
    console.log("Flags:", this.flags);
  }

  getMineIndexes() {
    const mines = [];
    this.mines.forEach((cell) => {
      mines.push(cell.dataset.index);
    });
    return mines;
  }

  placeNumber(cell) {
    const index = parseInt(cell.dataset.index);
    const adjacentMines = this.getAdjacentMines(
      CONFIG.CELLSACROSS,
      CONFIG.CELLSDOWN,
      index
    );
    
    switch (adjacentMines) {
      case 1:
        cell.style.backgroundImage = "url('./assets/images/1.png')";
        break;
      case 2:
        cell.style.backgroundImage = "url('./assets/images/2.png')";
        break;
      case 3:
        cell.style.backgroundImage = "url('./assets/images/3.png')";
        break;
      case 4:
        cell.style.backgroundImage = "url('./assets/images/4.png')";
        break;
      case 5:
        cell.style.backgroundImage = "url('./assets/images/5.png')";
        break;
      case 6:
        cell.style.backgroundImage = "url('./assets/images/6.png')";
        break;
      case 7:
        cell.style.backgroundImage = "url('./assets/images/7.png')";
        break;
      case 8:
        cell.style.backgroundImage = "url('./assets/images/8.png')";
        break;
      default:
        cell.style.backgroundImage = "none";
    }

  }

  getAdjacentMines(cols, rows, index) {
    let mineCount = 0;
    const neighbors = [];
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
          neighbors.push(newRow * cols + newCol);
        }
      }
    }
    neighbors.forEach((index) => {
      let mines = this.getMineIndexes().map(Number);
      if (mines.includes(index)) {
        mineCount += 1;
      }
    });
    return mineCount;
  }

}