const rootStyles = getComputedStyle(document.documentElement)
export const CONFIG = {
    CELLSIZE: parseInt(rootStyles.getPropertyValue('--cell-size')),
    CELLSACROSS: 25,
    CELLSDOWN: 18,
    MINES: 60

}