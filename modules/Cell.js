import { CONFIG } from "./CONFIG.js";

export class Cell {
  constructor(index) {
    this.mine = false;
    this.index = index;
    this.flagged = false;
    this.element = this.init(index);
  }

  init(index) {
    const cell = document.createElement("div");
    cell.classList.add("cell", "cell-closed");
    cell.dataset.index = index;
    return cell;
  }

  open() {
    this.element.classList.remove("cell-closed");
    this.element.classList.add("cell-opened");
  }
}
