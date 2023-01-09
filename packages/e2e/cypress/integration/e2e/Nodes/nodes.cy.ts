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

  describe("Movements with autoscroll", () => {
    const checkNodePosition = (x: number, y: number) =>
      nodesModel
        .nodePosition(1)
        .then(coordinatesFromMatrix)
        .then(([xCoord, yCoord]) => {
          expect(Number(xCoord)).to.be.closeTo(x, 100)
          expect(Number(yCoord)).to.be.closeTo(y, 100)
        })

    it("Should autoscroll top", () => {
      nodesModel.dndWithDelayUp(350, 150, 400, 100)

      checkNodePosition(160, -1500)
    })

    it("Should autoscroll right", () => {
      nodesModel.dndWithDelayUp(350, 150, 990, 300)

      checkNodePosition(4300, 260)
    })

    it("Should autoscroll bottom", () => {
      nodesModel.dndWithDelayUp(350, 150, 350, 590)

      checkNodePosition(110, 1100)
    })

    it("Should autoscroll left", () => {
      nodesModel.dndWithDelayUp(350, 150, 240, 300)

      checkNodePosition(-2050, 260)
    })

    it("Should autoscroll two direction at corners", () => {
      nodesModel.dndWithDelayUp(350, 150, 990, 100)

      checkNodePosition(4320, -1550)
    })

    it("Should autoscroll with zoom", () => {
      nodesModel.wheelDirection(Array(23).fill(WheelDirection.bottom))
      nodesModel.dndWithDelayUp(520, 295, 990, 100)

      checkNodePosition(2700, -1000)
    })
  })
})
