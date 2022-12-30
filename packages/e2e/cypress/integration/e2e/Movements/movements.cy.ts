import { coordinatesFromMatrix } from "../helpers"
import { MovementsModel } from "./Movements.model"

const movementsModel = new MovementsModel()

context("Node simple DnDs", () => {
  beforeEach(movementsModel.open)

  describe("Movements without autoscroll", () => {
    it("Should single node move correctly", () => {
      movementsModel.nodePosition(1).should("be.equal", "matrix(1, 0, 0, 1, 110, 110)")

      movementsModel.dnd(350, 150, 400, 200)

      movementsModel.nodePosition(1).should("be.equal", "matrix(1, 0, 0, 1, 160, 160)")

      movementsModel.dnd(550, 350, 400, 200)

      movementsModel.nodePosition(2).should("be.equal", "matrix(1, 0, 0, 1, 160, 160)")
    })

    it("Should move canvas", () => {
      movementsModel
        .canvasPosition()
        .then(coordinatesFromMatrix)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(15, 1)
          expect(Number(y)).to.be.closeTo(-35, 1)
        })

      movementsModel.dnd(350, 350, 450, 450)

      movementsModel
        .canvasPosition()
        .then(coordinatesFromMatrix)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(115, 1)
          expect(Number(y)).to.be.closeTo(65, 1)
        })
    })
  })
})
