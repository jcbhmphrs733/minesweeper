import { CONFIG } from "./CONFIG.js";

export class ThemeManager {
  constructor() {
    this.applyTheme();
  }

  applyTheme() {
    const theme = CONFIG.CURRENT_THEME;
    
    // Apply cell size from CONFIG
    document.documentElement.style.setProperty('--cell-size', `${CONFIG.CELLSIZE}px`);
    
    // Apply theme colors to CSS custom properties
    document.documentElement.style.setProperty('--bg-color', theme.background);
    document.documentElement.style.setProperty('--game-container-bg', theme.gameContainer);
    document.documentElement.style.setProperty('--cell-closed-bg', theme.cellClosed);
    document.documentElement.style.setProperty('--cell-opened-bg', theme.cellOpened);
    document.documentElement.style.setProperty('--cell-border', theme.cellBorder);
    document.documentElement.style.setProperty('--ui-bg', theme.uiBackground);
    document.documentElement.style.setProperty('--ui-border', theme.uiBorder);
    document.documentElement.style.setProperty('--timer-color', theme.timer);
    document.documentElement.style.setProperty('--mine-counter-color', theme.mineCounter);
    document.documentElement.style.setProperty('--reset-button-bg', theme.resetButton);
    document.documentElement.style.setProperty('--reset-button-hover', theme.resetButtonHover);
    document.documentElement.style.setProperty('--reset-button-border', theme.resetButtonBorder);
    document.documentElement.style.setProperty('--flag-color', theme.flagColor);
    document.documentElement.style.setProperty('--incorrect-flag-color', theme.incorrectFlagColor);
    document.documentElement.style.setProperty('--correct-flag-color', theme.correctFlagColor);
    
    // Apply restart icon
    const resetIconElement = document.getElementById('reset-icon');
    if (resetIconElement) {
      resetIconElement.textContent = theme.restartIcon;
    }
  }

  changeTheme(themeName) {
    CONFIG.THEME = themeName;
    this.applyTheme();
  }

  updateCellSize(newSize) {
    CONFIG.CELLSIZE = newSize;
    document.documentElement.style.setProperty('--cell-size', `${newSize}px`);
  }

  applyConfig() {
    // Apply all CONFIG-controlled CSS properties
    document.documentElement.style.setProperty('--cell-size', `${CONFIG.CELLSIZE}px`);
    this.applyTheme();
  }

  getAvailableThemes() {
    return Object.keys(CONFIG.CURRENT_THEME.constructor);
  }
}
