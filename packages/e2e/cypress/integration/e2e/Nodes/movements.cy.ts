import {
  BROWSER_PX_DEVIATION,
  CANVAS_ZONE_POINTS,
  CLICK_COORDS,
  NodeState,
  WheelDirection,
  ZOOM_IN_COUNT
} from "../constants"
import { coordinatesFromMatrix } from "../helpers"
import { CONTEXT } from "./constants"
import { nodesModel } from "./Nodes.model"

context(CONTEXT, () => {
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
      expect(Number(x)).to.closeTo(160, BROWSER_PX_DEVIATION)
      expect(Number(y)).to.closeTo(160, BROWSER_PX_DEVIATION)
    }

    it("Should single node move correctly", () => {
      nodesModel.dnd(CLICK_COORDS.FIRST_NODE.X, CLICK_COORDS.FIRST_NODE.Y, 400, 200)

      nodesModel.nodePosition(1).then(coordinatesFromMatrix).then(verifyEndNodePoint)

      nodesModel.dnd(CLICK_COORDS.SECOND_NODE.X, CLICK_COORDS.SECOND_NODE.Y, 400, 200)

      nodesModel.nodePosition(2).then(coordinatesFromMatrix).then(verifyEndNodePoint)
    })

    it("Should has 'dragging' state", () => {
      nodesModel.getRoot().realMouseDown({ position: { x: CLICK_COORDS.FIRST_NODE.X, y: CLICK_COORDS.FIRST_NODE.Y } })

      const checkFirstDragging = (isDragging: boolean) =>
        nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass(NodeState.dragging)).to.be.equals(isDragging))

      checkFirstDragging(false)

      nodesModel.getRoot().realMouseMove(400, 200)

      checkFirstDragging(true)

      nodesModel.getRoot().realMouseUp({ position: { x: 400, y: 200 } })
      checkFirstDragging(false)
    })

    it("Should multiple node movements correctly", () => {
      nodesModel.dnd(CLICK_COORDS.FIRST_NODE.X, CLICK_COORDS.FIRST_NODE.Y, 400, 200)
      nodesModel.dnd(CLICK_COORDS.FIRST_NODE.X, CLICK_COORDS.FIRST_NODE.Y, 450, CLICK_COORDS.FIRST_NODE.Y)
      nodesModel.dnd(450, CLICK_COORDS.FIRST_NODE.Y, 400, 250)
      nodesModel.dnd(400, 250, 400, 200)

      nodesModel.nodePosition(1).then(coordinatesFromMatrix).then(verifyEndNodePoint)
    })
  })

  describe("Movements with autoscroll", () => {
    const checkCornerAutoscroll = () =>
      nodesModel.nodePositionNumeric(1).then(([x, y]) => {
        expect(Number(y)).to.be.lessThan(0)
        expect(Number(x)).to.be.greaterThan(800)
      })

    it("Should autoscroll top", () => {
      nodesModel.dndWithDelayUp(CLICK_COORDS.FIRST_NODE.X, CLICK_COORDS.FIRST_NODE.Y, 400, 50)
      nodesModel.nodePositionNumeric(1).then(([_, y]) => expect(Number(y)).to.be.lessThan(0))
    })

    it("Should autoscroll right", () => {
      nodesModel.dndWithDelayUp(CLICK_COORDS.FIRST_NODE.X, CLICK_COORDS.FIRST_NODE.Y, CANVAS_ZONE_POINTS.RIGHT, 300)

      nodesModel.nodePositionNumeric(1).then(([x]) => expect(Number(x)).to.be.greaterThan(800))
    })

    it("Should autoscroll bottom", () => {
      nodesModel.dndWithDelayUp(
        CLICK_COORDS.FIRST_NODE.X,
        CLICK_COORDS.FIRST_NODE.Y,
        CLICK_COORDS.FIRST_NODE.X,
        CANVAS_ZONE_POINTS.BOTTOM
      )

      nodesModel.nodePositionNumeric(1).then(([_, y]) => expect(Number(y)).to.be.greaterThan(610))
    })

    it("Should autoscroll left", () => {
      nodesModel.dndWithDelayUp(CLICK_COORDS.FIRST_NODE.X, CLICK_COORDS.FIRST_NODE.Y, 240, 200)

      nodesModel.nodePositionNumeric(1).then(([x]) => expect(Number(x)).to.be.lessThan(0))
    })

    it("Should autoscroll two direction at corners", () => {
      nodesModel.dndWithDelayUp(
        CLICK_COORDS.FIRST_NODE.X,
        CLICK_COORDS.FIRST_NODE.Y,
        CANVAS_ZONE_POINTS.RIGHT,
        CANVAS_ZONE_POINTS.TOP
      )

      checkCornerAutoscroll()
    })

    it("Should autoscroll with zoom", () => {
      nodesModel.wheelDirection(Array(ZOOM_IN_COUNT).fill(WheelDirection.bottom))
      nodesModel.dndWithDelayUp(520, 295, CANVAS_ZONE_POINTS.RIGHT, CANVAS_ZONE_POINTS.TOP)

      checkCornerAutoscroll()
    })
  })
})
