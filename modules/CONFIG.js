import { getTheme } from "./THEMES.js";

export const CONFIG = {
    CELLSIZE: 28, // Control cell size from here
    CELLSACROSS: 25,
    CELLSDOWN: 15,
    MINES: 40,
    THEME: "classic", // Change this to: "classic", "dark", "ocean", "forest", or "sunset"
    get CURRENT_THEME() {
        return getTheme(this.THEME);
    },
    get NUMBER_COLORS() {
        return this.CURRENT_THEME.numberColors;
    }
};