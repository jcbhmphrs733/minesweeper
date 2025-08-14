import { CONFIG } from "./CONFIG.js";

export class CellManager {
  constructor(highScoreManager = null) {
    this.highScoreManager = highScoreManager;
  }
  
  mines = new Set();
  emptyCells = new Set();
  numberedCells = new Set();
  flags = new Set();
  cellsByIndex = new Map();
  mineCountElement = document.getElementById("mine-count");
  timerElement = document.getElementById("time-count");
  resetButton = document.getElementById("reset-button");
  gameStartTime = null;
  timerInterval = null;
  gameOver = false;
  gameStarted = false;
  initializing = false;

  createCell(index) {
    // Create cell object with all necessary properties
    const cell = {
      mine: false,
      index: index,
      flagged: false,
      element: this.createCellElement(index)
    };
    
    this.emptyCells.add(cell);
    this.cellsByIndex.set(index, cell);

    cell.element.addEventListener("mousedown", (event) => {
      if (event.button === 0) { // left click
        if (cell.element.classList.contains("cell-opened")) {
          // Chord click on already opened cell
          this.chordClick(cell);
        } else {
          // Normal click on closed cell
          this.openCell(cell);
        }
      } else if (event.button === 2) { // right click
        event.preventDefault();
        this.flag(cell);
      }
    });

    return cell.element;
  }

  createCellElement(index) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell", "cell-closed");
    cellElement.dataset.index = index;
    return cellElement;
  }

  addMine(cell) {
    cell.element.classList.add("mine");
    cell.mine = true;
    this.mines.add(cell);
    this.emptyCells.delete(cell);
  }

  flag(cell) {
    // Prevent any flag changes when game is over
    if (this.gameOver) return;
    
    if (this.flags.has(cell)) {
      cell.flagged = false;
      cell.element.innerHTML = "";
      cell.element.classList.remove("flagged");
      this.flags.delete(cell);
    } else if (cell.element.classList.contains("cell-closed")) {
      cell.flagged = true;
      cell.element.innerHTML = `<span style='color: ${CONFIG.CURRENT_THEME.flagColor};'><strong>F</strong></span>`;
      cell.element.classList.add("flagged");
      this.flags.add(cell);
    }
    this.updateMineCounter();
  }

  updateMineCounter() {
    const remainingMines = CONFIG.MINES - this.flags.size;
    this.mineCountElement.textContent = remainingMines;
  }

  initializeMineCounter() {
    this.updateMineCounter();
  }

  openCell(cell) {
    if (cell.element.classList.contains("cell-opened") || cell.flagged || this.gameOver) return;
    
    // Open the cell (equivalent to the old cell.open() method)
    cell.element.classList.remove("cell-closed");
    cell.element.classList.add("cell-opened");
    
    if (cell.mine) {
      this.handleGameOver();
      return;
    }
    
    // Place number and check for flood fill
    const adjacentMines = this.countAdjacentMines(cell.index);
    if (adjacentMines > 0) {
      this.placeNumber(cell.element);
    } else {
      // Flood fill for empty cells
      this.floodFill(cell.index);
    }
    
    // Only check for win condition if game has actually started
    if (this.gameStarted && !this.initializing) {
      this.checkWinCondition();
    }
  }

  checkWinCondition() {
    if (this.gameOver) return;
    
    const totalCells = CONFIG.CELLSACROSS * CONFIG.CELLSDOWN;
    const openedCells = this.numberedCells.size + this.getOpenedEmptyCells();
    
    // Win condition: opened cells + mines = total cells
    if (openedCells + this.mines.size === totalCells) {
      this.handleWin();
    }
  }

  getOpenedEmptyCells() {
    // Count empty cells that are opened (no number, no mine)
    return Array.from(this.cellsByIndex.values()).filter(cell => 
      cell.element.classList.contains("cell-opened") && 
      !cell.mine && 
      !this.numberedCells.has(cell)
    ).length;
  }

  async handleWin() {
    console.log("You won!");
    this.gameOver = true;
    const finalTime = this.stopTimer();
    
    // Add score to high scores if manager exists
    if (this.highScoreManager && finalTime > 0) {
      // Check if this would be a high score first
      const currentScores = this.highScoreManager.getHighScores();
      const wouldBeHighScore = currentScores.length < 5 || finalTime < currentScores[4].time;
      
      if (wouldBeHighScore) {
        // Show name input modal for high scores
        const rank = await this.highScoreManager.showNameInput(finalTime);
        if (rank) {
          console.log(`New high score! Rank #${rank}`);
        }
      } else {
        // Still add the score without showing modal
        this.highScoreManager.addScore(finalTime, "Anonymous");
      }
    }
    
    // Optional: Auto-flag remaining mines
    this.mines.forEach(mine => {
      if (!mine.flagged) {
        mine.flagged = true;
        mine.element.classList.add("flagged");
        mine.element.innerHTML = `<span style='color: ${CONFIG.CURRENT_THEME.correctFlagColor};'><strong>F</strong></span>`;
        this.flags.add(mine);
      }
    });
    
    this.updateMineCounter();
  }

  chordClick(cell) {
    // Prevent chord clicking when game is over
    if (this.gameOver || !cell.element.classList.contains("cell-opened") || cell.mine) return;
    
    const adjacentMines = this.countAdjacentMines(cell.index);
    const flaggedNeighbors = this.countFlaggedNeighbors(cell.index);
    
    // If number of flagged neighbors equals the number on the cell
    if (adjacentMines > 0 && flaggedNeighbors === adjacentMines) {
      const neighbors = this.getCellNeighbors(cell.index);
      
      neighbors.forEach(neighborIndex => {
        const neighbor = this.getCellAtIndex(neighborIndex);
        if (neighbor && !neighbor.element.classList.contains("cell-opened") && !neighbor.flagged) {
          this.openCell(neighbor);
        }
      });
    }
  }

  countFlaggedNeighbors(cellIndex) {
    return this.getCellNeighbors(cellIndex)
      .map(index => this.getCellAtIndex(index))
      .filter(cell => cell?.flagged).length;
  }

  floodFill(cellIndex) {
    const neighbors = this.getCellNeighbors(cellIndex);
    
    neighbors.forEach(neighborIndex => {
      const neighbor = this.getCellAtIndex(neighborIndex);
      if (neighbor && !neighbor.element.classList.contains("cell-opened") && !neighbor.flagged) {
        this.openCell(neighbor); // Recursive call
      }
    });
  }

  startTimer() {
    this.gameStartTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (!this.gameOver) {
        const elapsedMs = Date.now() - this.gameStartTime;
        const totalSeconds = elapsedMs / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const hundredths = Math.floor((elapsedMs % 1000) / 10);
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
        this.timerElement.textContent = timeString;
      }
    }, 10); // Update every 10ms for hundredths precision
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // Return the final time in milliseconds
    if (this.gameStartTime) {
      return Date.now() - this.gameStartTime;
    }
    return 0;
  }

  handleGameOver() {
    console.log("game over");
    this.gameOver = true;
    this.stopTimer();
    
    // Handle mines: only show unflagged mines
    this.mines.forEach((mine) => {
      if (!mine.flagged) {
        // Show unflagged mines
        mine.element.classList.remove("cell-closed");
        mine.element.classList.add("cell-opened");
        mine.element.innerHTML = "M";
      }
      // Leave flagged mines as they are (flag stays, mine concealed)
    });

    // Handle incorrect flags: change F to ! for flags on non-mines
    this.flags.forEach((flaggedCell) => {
      if (!flaggedCell.mine) {
        // This flag is on a non-mine cell, show as incorrect
        flaggedCell.element.innerHTML = `<span style='color: ${CONFIG.CURRENT_THEME.incorrectFlagColor};'><strong>X</strong></span>`;
      }
    });
  }

  resetGame() {
    // Stop timer
    this.stopTimer();
    
    // Reset game state
    this.gameOver = false;
    this.gameStarted = false;
    this.initializing = true;
    this.gameStartTime = null;
    this.timerElement.textContent = "00:00.00";
    
    // Clear all sets and maps
    this.mines.clear();
    this.emptyCells.clear();
    this.numberedCells.clear();
    this.flags.clear();
    this.cellsByIndex.clear();
    
    // Clear the minefield
    const minefield = document.getElementById("minefield");
    minefield.innerHTML = "";
    
    // Trigger recreation of the game
    const event = new CustomEvent('resetGame');
    document.dispatchEvent(event);
  }

  initializeGame() {
    // Initialize mine counter
    this.initializeMineCounter();
    
    // Start the timer immediately when game is initialized
    this.startTimer();
    this.gameStarted = true;
    
    // Set up reset button (only once)
    if (!this.resetButton.hasAttribute('data-initialized')) {
      this.resetButton.addEventListener('click', () => {
        this.resetGame();
      });
      this.resetButton.setAttribute('data-initialized', 'true');
    }
  }

  getCellAtIndex(index) {
    return this.cellsByIndex.get(index) || null;
  }

  getCellNeighbors(index) {
    const neighbors = [];
    const cols = CONFIG.CELLSACROSS;
    const rows = CONFIG.CELLSDOWN;
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
    return neighbors;
  }

  placeNumber(cellElement) {
    const cell = this.getCellAtIndex(parseInt(cellElement.dataset.index));
    this.numberedCells.add(cell);
    this.emptyCells.delete(cell);
    
    const adjacentMines = this.countAdjacentMines(parseInt(cellElement.dataset.index));
    if (adjacentMines > 0) {
      cellElement.innerHTML = `<span style='color: ${CONFIG.NUMBER_COLORS[adjacentMines]};'><strong>${adjacentMines}</strong></span>`;
    }
  }

  countAdjacentMines(cellIndex) {
    return this.getCellNeighbors(cellIndex)
      .map(index => this.getCellAtIndex(index))
      .filter(cell => cell?.mine).length;
  }
}
