import { CANVAS_ZONE_POINTS, CLICK_COORDS, WheelDirection, ZOOM_OUT_COUNT } from "../constants"
import { zoomFromMatrix } from "../helpers"
import { CONTEXT } from "../Nodes/constants"
import { canvasModel } from "./Canvas.model"
import { INITIAL_OVERVIEW_X, INITIAL_OVERVIEW_Y } from "./constants"
import { checkCanvasPosition } from "./helpers"

context(CONTEXT, () => {
  beforeEach(canvasModel.open)

  describe("Overview", () => {
    it("Should overview simple", () => {
      cy.contains("Overview").click()

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.equals", 1)
      checkCanvasPosition(INITIAL_OVERVIEW_X, INITIAL_OVERVIEW_Y)
    })

    it("Should overview zoom in", () => {
      canvasModel.dnd(200, 200, 400, 400)
      canvasModel.wheelDirection(Array(ZOOM_OUT_COUNT).fill(WheelDirection.top))

      cy.contains("Overview").click()

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.equals", 1)
      checkCanvasPosition(64, -15)
    })

    it("Should overview big scale", () => {
      canvasModel.dndWithDelayUp(
        CLICK_COORDS.FIRST_NODE.X,
        CLICK_COORDS.FIRST_NODE.Y,
        CANVAS_ZONE_POINTS.RIGHT,
        CANVAS_ZONE_POINTS.TOP,
        1000
      )

      cy.contains("Overview").click()

      // toDO write tests after https://github.com/kseniaSs/react-flow-editor/pull/97 will be merged
    })
  })
})
