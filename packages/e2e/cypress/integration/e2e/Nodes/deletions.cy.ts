import { CONTEXT } from "./constants"
import { nodesModel } from "./Nodes.model"

context(CONTEXT, () => {
  beforeEach(nodesModel.open)

  const checkNodesCount = (count: number) =>
    nodesModel.nodesElements().then(($el) => expect($el.get()).to.have.length(count))

  describe("Deletions", () => {
    it("Should not do anything without selected nodes", () => {
      cy.realPress("Backspace")
      cy.realPress("Delete")

      checkNodesCount(3)
    })

    it("Should delete single node on backspace", () => {
      nodesModel.getRoot().realClick({ x: 550, y: 350 })

      cy.realPress("Backspace")
      checkNodesCount(2)
    })

    it("Should delete single node on delete", () => {
      nodesModel.getRoot().realClick({ x: 550, y: 350 })

      cy.realPress("Delete")
      checkNodesCount(2)
    })

    it("Should  delete multiple nodes", () => {
      nodesModel.nodeClick(2)
      nodesModel.getNode(3).click({ shiftKey: true, force: true })

      cy.realPress("Backspace")

      checkNodesCount(1)
    })

    it("Should not delete important nodes", () => {
      nodesModel.getRoot().realClick({ x: 350, y: 150 })

      cy.realPress("Backspace")
      checkNodesCount(3)
    })

    it("Should not delete important nodes on multiple delete", () => {
      nodesModel.nodeClick(1)
      nodesModel.getNode(2).click({ shiftKey: true, force: true })

      cy.realPress("Backspace")

      checkNodesCount(2)
    })
  })
})
