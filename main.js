import { CellManager } from './modules/CellManager.js';
import { GridManager } from './modules/GridManager.js';
import { ThemeManager } from './modules/ThemeManager.js';
import { HighScoreManager } from './modules/HighScoreManager.js';

class MinesweeperApp {
    constructor() {
        this.themeManager = null;
        this.cellManager = null;
        this.gridManager = null;
        this.highScoreManager = null;
        this.init()
    }

    init() {
        this.themeManager = new ThemeManager();
        this.highScoreManager = new HighScoreManager();
        this.cellManager = new CellManager(this.highScoreManager);
        this.gridManager = new GridManager(this.cellManager);
    }

    // Method to dynamically update cell size
    updateCellSize(newSize) {
        this.themeManager.updateCellSize(newSize);
        // Recreate grid with new cell size
        this.cellManager.resetGame();
        // Update high score display for new configuration
        this.highScoreManager.updateHighScoreDisplay();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('contextmenu', (event) => event.preventDefault());
    window.minesweeperApp = new MinesweeperApp();
});

export { MinesweeperApp };