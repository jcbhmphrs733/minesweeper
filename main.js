import { CellManager } from './modules/CellManager.js';
import { GridManager } from './modules/GridManager.js';
import { ThemeManager } from './modules/ThemeManager.js';

class MinesweeperApp {
    constructor() {
        this.themeManager = null;
        this.cellManager = null;
        this.gridManager = null;
        this.init()
    }

    init() {
        this.themeManager = new ThemeManager();
        this.cellManager = new CellManager();
        this.gridManager = new GridManager(this.cellManager);
    }

    // Method to dynamically update cell size
    updateCellSize(newSize) {
        this.themeManager.updateCellSize(newSize);
        // Recreate grid with new cell size
        this.cellManager.resetGame();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('contextmenu', (event) => event.preventDefault());
    window.minesweeperApp = new MinesweeperApp();
});

export { MinesweeperApp };