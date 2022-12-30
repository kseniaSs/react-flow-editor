import selectors from "./selectors"

export class RootModel {
  open() {
    cy.visit(Cypress.env("HOST"))
    cy.wait(100)
  }
  getRoot() {
    return cy.get(selectors.ROOT)
  }
  getNode(nodeNumber: number) {
    return cy.get(selectors.SINGLE_NODE + nodeNumber)
  }
  getConnections() {
    return cy.get(selectors.CONNECTION)
  }
  getFirstConnectionPath() {
    return cy
      .get(selectors.CONNECTION)
      .first()
      .then(($el) => $el.attr("d"))
  }
  getLastConnectionPath() {
    return cy
      .get(selectors.CONNECTION)
      .last()
      .then(($el) => $el.attr("d") as string)
  }
  getCanvas() {
    return cy.get(selectors.ZOOM_CONTAINER)
  }
  mouseDown(x: number, y: number) {
    return this.getRoot().realMouseDown({ position: { x, y } })
  }
  mouseUp(x: number, y: number) {
    return this.getRoot().realMouseUp({ position: { x, y } })
  }
  dnd(fromX: number, fromY: number, toX: number, toY: number) {
    return this.getRoot()
      .realMouseDown({ position: { x: fromX, y: fromY } })
      .realMouseMove(toX, toY)
      .realMouseUp({ position: { x: toX, y: toY } })
  }

  nodePosition(nodeNumber: number) {
    return this.getNode(nodeNumber).then(($el) => $el.css("transform"))
  }
}
