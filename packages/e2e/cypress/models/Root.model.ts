import selectors from "./selectors"

export class RootModel {
  open() {
    cy.visit(Cypress.env("HOST"))
  }
  getNode(nodeNumber: number) {
    return cy.get(selectors.SINGLE_NODE + nodeNumber)
  }
  dnd(nodeNumber: number, dx: number, dy: number) {
    return this.getNode(nodeNumber).realMouseDown().realMouseMove(dx, dy).realMouseUp()
  }
  nodeRect(nodeNumber: number) {
    return this.getNode(nodeNumber).then(($el: JQuery<HTMLElement>) => $el.get()[0].getBoundingClientRect())
  }
}
