import { NODES_CONTEXT } from "./constants"
import { nodesModel } from "./Nodes.model"

context(NODES_CONTEXT, () => {
  beforeEach(nodesModel.open)

  describe("Movements without autoscroll", () => {
    it("Should single node move correctly", () => {
      nodesModel.nodePosition(1).should("be.equal", "matrix(1, 0, 0, 1, 110, 110)")

      nodesModel.dnd(350, 150, 400, 200)

      nodesModel.nodePosition(1).should("be.equal", "matrix(1, 0, 0, 1, 160, 160)")

      nodesModel.dnd(550, 350, 400, 200)

      nodesModel.nodePosition(2).should("be.equal", "matrix(1, 0, 0, 1, 160, 160)")
    })
  })
})
