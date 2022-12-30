import selectors from "./selectors"

export class RootModel {
  open() {
    cy.visit(Cypress.env("HOST"))
    cy.wait(100)
  }
  getRoot() {
    return cy.get(selectors.ROOT)
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
}
