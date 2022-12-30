import { RootModel, selectors } from "../../../models"

export class CanvasModel extends RootModel {
  canvasPosition() {
    return this.getCanvas().then(($el) => $el.css("transform"))
  }
  canvasPositionOrigin() {
    return this.getCanvas().then(($el) => $el.css("transform-origin"))
  }
  getCanvas() {
    return cy.get(selectors.ZOOM_CONTAINER)
  }
}

export const canvasModel = new CanvasModel()
