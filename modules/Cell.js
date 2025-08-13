import { CONFIG } from "./CONFIG.js";

export class Cell {
  constructor(value, index) {
    this.value = value;
    this.index = index;
    this.flagged = false;

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

  
  open(cell) {
    if (cell.classList.contains("cell-opened")) {
      // open recursively
      console.log("im already opened!")


    }
    else {
      // first time opening the cell
      if (this.mines.has(cell)) {
        // Handle mine opening
        console.log("you opened a mine");
        this.mines.forEach((mine) => {
          mine.classList.remove("cell-closed")
          mine.classList.add("cell-opened")
          mine.innerHTML = "M"
          // mine.style.backgroundImage = "url('./assets/images/mine.png')";
        });
        this.emptyCells.forEach((cell) => {
          cell.classList.remove("cell-closed");
          cell.classList.add("cell-opened");
          this.placeNumber(cell);
        });
      } else {
        // Handle safe cell opening
        console.log("you opened a safe cell");
        cell.classList.remove("cell-closed");
        cell.classList.add("cell-opened");
        this.placeNumber(cell);
      }
    }
    console.log(`mines remaining: ${this.mines.size - this.flags.size}`)
    console.log("empty cells: " + this.emptyCells.size)
    console.log("numbered cells: " + this.numberedCells.size)
  }

  flag(cell) {
    if (this.flags.has(cell)) {
      cell.classList.remove("flagged");
      this.flags.delete(cell);
    } else {
      if (cell.classList.contains("cell-closed")) {
        cell.classList.add("flagged");
        this.flags.add(cell);
      }
    }
  }

  getMineIndexes() {
    const mines = [];
    this.mines.forEach((cell) => {
      mines.push(cell.dataset.index);
    });
    return mines;
  }

  placeNumber(cell) {
    this.numberedCells.add(cell)
    this.emptyCells.delete(cell)
    const index = parseInt(cell.dataset.index);
    const adjacentMines = this.countAdjacentMines(
      CONFIG.CELLSACROSS,
      CONFIG.CELLSDOWN,
      index
    );

    switch (adjacentMines) {
      case 1:
        cell.innerHTML = "<span style='color: blue;'><strong>1</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/1.png')";
        break;
      case 2:
        cell.innerHTML = "<span style='color: green;'><strong>2</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/2.png')";
        break;
      case 3:
        cell.innerHTML = "<span style='color: red;'><strong>3</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/3.png')";
        break;
      case 4:
        cell.innerHTML = "<span style='color: navy;'><strong>4</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/4.png')";
        break;
      case 5:
        cell.innerHTML = "<span style='color: maroon;'><strong>5</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/5.png')";
        break;
      case 6:
        cell.innerHTML = "<span style='color: teal;'><strong>6</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/6.png')";
        break;
      case 7:
        cell.innerHTML = "<span style='color: black;'><strong>7</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/7.png')";
        break;
      case 8:
        cell.innerHTML = "<span style='color: gray;'><strong>8</strong></span>"
        // cell.style.backgroundImage = "url('./assets/images/8.png')";
        break;
      default:
      // cell.style.backgroundImage = "none";
    }

  }

  countAdjacentMines(cols, rows, index) {
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