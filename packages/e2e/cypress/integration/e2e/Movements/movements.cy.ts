import { MovementsModel } from "./Movements.model"

const movementsModel = new MovementsModel()

context("Node simple DnDs", () => {
  beforeEach(movementsModel.open)

  describe("Movements without autoscroll", () => {
    it("Should single node move correctly", async () => {
      cy.screenshot("test")

      movementsModel
        .nodeRect(1)
        .then((beforeRect) => movementsModel.dnd(1, 50, 50).then(() => beforeRect))
        .then((beforeRect) => movementsModel.nodeRect(1).then((afterRect) => ({ beforeRect, afterRect })))
        .then(({ beforeRect, afterRect }) => {
          cy.log(JSON.stringify(beforeRect), JSON.stringify(afterRect))
          expect(afterRect.left - beforeRect.left).to.equal(50)

          cy.screenshot("test1")
        })
    })
  })
})
