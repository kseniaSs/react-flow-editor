import { BROWSER_PX_DEVIATION, WheelDirection, ZOOM_IN_COUNT, ZOOM_OUT_COUNT, ZOOM_PX_DEVIATION } from "../constants"
import { coordinatesFromStringPX, zoomFromMatrix } from "../helpers"
import { canvasModel } from "./Canvas.model"
import { CONTEXT } from "./context"
import { checkCanvasPosition } from "./helpers"

const CANVAS_MOVE_POINT_X = 350
const CANVAS_MOVE_POINT_Y = 350

context(CONTEXT, () => {
  beforeEach(canvasModel.open)

  const checkCanvasOriginPosition = (x: number, y: number) =>
    canvasModel
      .canvasPositionOrigin()
      .then(coordinatesFromStringPX)
      .then(([xCoord, yCoord]) => {
        expect(Number(xCoord)).to.be.closeTo(x, BROWSER_PX_DEVIATION)
        expect(Number(yCoord)).to.be.closeTo(y, BROWSER_PX_DEVIATION)
      })

  describe("Initializing", () => {
    it("Should match default position", () => {
      checkCanvasPosition(15, -35)
      checkCanvasOriginPosition(385, 340)
    })
  })

  describe("Movements DnD", () => {
    const matchEndPosition = () => {
      checkCanvasPosition(115, 65)
      checkCanvasOriginPosition(285, 240)
    }

    it("Should move canvas one movement", () => {
      canvasModel.dnd(CANVAS_MOVE_POINT_X, CANVAS_MOVE_POINT_Y, 450, 450)

      matchEndPosition()
    })

    it("Should move canvas chain movement", () => {
      canvasModel.dnd(CANVAS_MOVE_POINT_X, CANVAS_MOVE_POINT_Y, 550, 550)
      canvasModel.dnd(550, 550, 550, CANVAS_MOVE_POINT_Y)
      canvasModel.dnd(550, CANVAS_MOVE_POINT_Y, 450, 450)

      matchEndPosition()
    })

    it("Should move canvas long movement", () => {
      canvasModel
        .mouseDown(CANVAS_MOVE_POINT_X, CANVAS_MOVE_POINT_Y)
        .realMouseMove(550, 550)
        .realMouseMove(550, CANVAS_MOVE_POINT_Y)
        .realMouseMove(450, 450)
      canvasModel.mouseUp(450, 450)

      matchEndPosition()
    })
  })

  describe("Zoom interactions", () => {
    it("Should zoom out properly once", () => {
      canvasModel.wheel(WheelDirection.bottom)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.95, ZOOM_PX_DEVIATION)
    })

    it("Should zoom out properly multiple", () => {
      canvasModel.wheelDirection(Array(3).fill(WheelDirection.bottom))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.86, ZOOM_PX_DEVIATION)
    })

    it("Should zoom out properly to low threshold", () => {
      canvasModel.wheelDirection(Array(ZOOM_OUT_COUNT).fill(WheelDirection.bottom))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.2, ZOOM_PX_DEVIATION)
    })

    it("Should zoom in properly once", () => {
      canvasModel.wheel(WheelDirection.top)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 1.05, ZOOM_PX_DEVIATION)
    })

    it("Should zoom in properly multiple", () => {
      canvasModel.wheelDirection(Array(3).fill(WheelDirection.top))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 1.15, ZOOM_PX_DEVIATION)
    })

    it("Should zoom in properly to high threshold", () => {
      canvasModel.wheelDirection(Array(ZOOM_IN_COUNT).fill(WheelDirection.top))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 3, ZOOM_PX_DEVIATION)
    })

    it("Should zoom properly bidirectionally", () => {
      canvasModel.wheelDirection([
        WheelDirection.top,
        WheelDirection.top,
        WheelDirection.bottom,
        WheelDirection.bottom,
        WheelDirection.bottom,
        WheelDirection.bottom,
        WheelDirection.bottom,
        WheelDirection.top
      ])

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.9, ZOOM_PX_DEVIATION)
    })

    it("Should zoom with move properly", () => {
      canvasModel.dnd(CANVAS_MOVE_POINT_X, CANVAS_MOVE_POINT_Y, 450, 450)
      canvasModel.wheel(WheelDirection.bottom)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.95, ZOOM_PX_DEVIATION)
      checkCanvasPosition(115, 65)
      checkCanvasOriginPosition(285, 240)
    })
  })
})
