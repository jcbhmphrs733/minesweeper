import { getTheme } from "./THEMES.js";

export const CONFIG = {
    CELLSIZE: 28, // Control cell size from here
    CELLSACROSS: 4,
    get CELLSDOWN() {
        return this.CELLSACROSS; // Always equals CELLSACROSS for square grid
    },
    DIFFICULTY: 2,
    get MINES() {
        return Math.floor(this.CELLSACROSS * this.CELLSDOWN * 0.10) * this.DIFFICULTY;
    },
    THEME: "dark", // Change this to: "classic", "dark", "ocean", "forest", or "sunset"
    get CURRENT_THEME() {
        return getTheme(this.THEME);
    },
    get NUMBER_COLORS() {
        return this.CURRENT_THEME.numberColors; 
    }
};