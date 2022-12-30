import { RootModel } from "../../../models"

export class CanvasModel extends RootModel {
  canvasPosition() {
    return this.getCanvas().then(($el) => $el.css("transform"))
  }
  canvasPositionOrigin() {
    return this.getCanvas().then(($el) => $el.css("transform-origin"))
  }
}

export const canvasModel = new CanvasModel()
