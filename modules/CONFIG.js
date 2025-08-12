const rootStyles = getComputedStyle(document.documentElement)
export const CONFIG = {
    CELLSIZE: parseInt(rootStyles.getPropertyValue('--cell-size')),
    CELLSACROSS: 5,
    CELLSDOWN: 5,
    MINES: 8

}