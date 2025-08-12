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
    cell.classList.add("cell");
    this.emptyCells.add(cell);
    cell.dataset.index = index;
    return cell;
  }

  addMine(cell) {
    cell.classList.add("mine");
    this.mines.add(cell);
    cell.innerHTML = "💣"; // Mine emoji
    this.emptyCells.delete(cell);
  }

  open(cell) {
    if (this.mines.has(cell)) {
      // Handle mine opening
    } else {
      // Handle safe cell opening
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
}
