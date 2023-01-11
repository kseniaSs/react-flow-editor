import { WheelDirection, ZOOM_OUT_COUNT } from "../constants"
import { zoomFromMatrix } from "../helpers"
import { CONTEXT } from "../Nodes/constants"
import { canvasModel } from "./Canvas.model"
import { checkCanvasPosition } from "./helpers"

context(CONTEXT, () => {
  beforeEach(canvasModel.open)

  describe("Overview", () => {
    it("Should overview simple", () => {
      cy.contains("Overview").click()

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.equals", 1)
      checkCanvasPosition(15, -35)
    })

    it("Should overview zoom in", () => {
      canvasModel.dnd(200, 200, 400, 400)
      canvasModel.wheelDirection(Array(ZOOM_OUT_COUNT).fill(WheelDirection.top))

      cy.contains("Overview").click()

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.equals", 1)
      checkCanvasPosition(64, -15)
    })

    it("Should overview big scale", () => {
      canvasModel.dndWithDelayUp(350, 150, 999, 300, 1000)

      cy.contains("Overview").click()

      // toDO write tests after https://github.com/kseniaSs/react-flow-editor/pull/97 will be merged
    })
  })
})
