import { CellManager } from './modules/CellManager.js';
import { GridManager } from './modules/GridManager.js';

class MinesweeperApp {
    constructor() {
        this.cellManager = null;
        this.gridManager = null;
        this.init()
    }

    init() {
        this.cellManager = new CellManager();
        this.gridManager = new GridManager(this.cellManager);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('contextmenu', (event) => event.preventDefault());
    window.minesweeperApp = new MinesweeperApp();
});

export { MinesweeperApp };