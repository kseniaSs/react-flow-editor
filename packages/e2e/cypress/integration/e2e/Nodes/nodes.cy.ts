import { WheelDirection } from "../constants"
import { coordinatesFromMatrix } from "../helpers"
import { nodesModel } from "./Nodes.model"

context("Nodes interactions", () => {
  beforeEach(nodesModel.open)

  describe("Initializing", () => {
    it("Should init correct node positions", () => {
      nodesModel.nodePosition(1).should("be.equal", "matrix(1, 0, 0, 1, 110, 110)")
      nodesModel.nodePosition(2).should("be.equal", "matrix(1, 0, 0, 1, 310, 310)")
      nodesModel.nodePosition(3).should("be.equal", "matrix(1, 0, 0, 1, 510, 510)")
    })
  })

  describe("Movements without autoscroll", () => {
    const verifyEndNodePoint = ([x, y]: [string, string]) => {
      expect(Number(x)).to.closeTo(160, 1)
      expect(Number(y)).to.closeTo(160, 1)
    }

    it("Should single node move correctly", () => {
      nodesModel.dnd(350, 150, 400, 200)

      nodesModel.nodePosition(1).then(coordinatesFromMatrix).then(verifyEndNodePoint)

      nodesModel.dnd(550, 350, 400, 200)

      nodesModel.nodePosition(2).then(coordinatesFromMatrix).then(verifyEndNodePoint)
    })

    it("Should multiple node movements correctly", () => {
      nodesModel.dnd(350, 150, 400, 200)
      nodesModel.dnd(350, 150, 450, 150)
      nodesModel.dnd(450, 150, 400, 250)
      nodesModel.dnd(400, 250, 400, 200)

      nodesModel.nodePosition(1).then(coordinatesFromMatrix).then(verifyEndNodePoint)
    })
  })

  describe.only("Movements with autoscroll", () => {
    const firstNodePosition = () => nodesModel.nodePosition(1).then(coordinatesFromMatrix)

    it("Should autoscroll top", () => {
      nodesModel.dndWithDelayUp(350, 150, 400, 50)
      firstNodePosition().then(([_, y]) => expect(Number(y)).to.be.lessThan(0))
    })

    it("Should autoscroll right", () => {
      nodesModel.dndWithDelayUp(350, 150, 999, 300)

      firstNodePosition().then(([x]) => expect(Number(x)).to.be.greaterThan(800))
    })

    it("Should autoscroll bottom", () => {
      nodesModel.dndWithDelayUp(350, 150, 350, 659)

      firstNodePosition().then(([_, y]) => expect(Number(y)).to.be.greaterThan(610))
    })

    it("Should autoscroll left", () => {
      nodesModel.dndWithDelayUp(350, 150, 240, 200)

      firstNodePosition().then(([x]) => expect(Number(x)).to.be.lessThan(0))
    })

    it("Should autoscroll two direction at corners", () => {
      nodesModel.dndWithDelayUp(350, 150, 990, 100)

      firstNodePosition().then(([x, y]) => {
        expect(Number(y)).to.be.lessThan(0)
        expect(Number(x)).to.be.greaterThan(800)
      })
    })

    it("Should autoscroll with zoom", () => {
      nodesModel.wheelDirection(Array(23).fill(WheelDirection.bottom))
      nodesModel.dndWithDelayUp(520, 295, 990, 100)

      firstNodePosition().then(([x, y]) => {
        expect(Number(y)).to.be.lessThan(0)
        expect(Number(x)).to.be.greaterThan(800)
      })
    })
  })
})
