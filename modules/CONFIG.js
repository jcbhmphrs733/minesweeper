const rootStyles = getComputedStyle(document.documentElement)
export const CONFIG = {
    CELLSIZE: parseInt(rootStyles.getPropertyValue('--cell-size')),
    CELLSACROSS: 10,
    CELLSDOWN: 10

}