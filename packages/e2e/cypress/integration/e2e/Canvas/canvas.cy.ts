import { BROWSER_PX_DEVIATION, WheelDirection } from "../constants"
import { coordinatesFromMatrix, coordinatesFromStringPX, zoomFromMatrix } from "../helpers"
import { canvasModel } from "./Canvas.model"

context("Canvas interactions", () => {
  beforeEach(canvasModel.open)

  const checkCanvasPosition = (x: number, y: number) =>
    canvasModel
      .canvasPosition()
      .then(coordinatesFromMatrix)
      .then(([xCoord, yCoord]) => {
        expect(Number(xCoord)).to.be.closeTo(x, BROWSER_PX_DEVIATION)
        expect(Number(yCoord)).to.be.closeTo(y, BROWSER_PX_DEVIATION)
      })

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
      canvasModel.dnd(350, 350, 450, 450)

      matchEndPosition()
    })

    it("Should move canvas chain movement", () => {
      canvasModel.dnd(350, 350, 550, 550)
      canvasModel.dnd(550, 550, 550, 350)
      canvasModel.dnd(550, 350, 450, 450)

      matchEndPosition()
    })

    it("Should move canvas long movement", () => {
      canvasModel.mouseDown(350, 350).realMouseMove(550, 550).realMouseMove(550, 350).realMouseMove(450, 450)
      canvasModel.mouseUp(450, 450)

      matchEndPosition()
    })
  })

  describe("Zoom interactions", () => {
    it("Should zoom out properly once", () => {
      canvasModel.wheel(WheelDirection.bottom)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.95, 0.01)
    })

    it("Should zoom out properly multiple", () => {
      canvasModel.wheelDirection(Array(3).fill(WheelDirection.bottom))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.86, 0.01)
    })

    it("Should zoom out properly to low threshold", () => {
      canvasModel.wheelDirection(Array(40).fill(WheelDirection.bottom))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.2, 0.01)
    })

    it("Should zoom in properly once", () => {
      canvasModel.wheel(WheelDirection.top)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 1.05, 0.01)
    })

    it("Should zoom in properly multiple", () => {
      canvasModel.wheelDirection(Array(3).fill(WheelDirection.top))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 1.15, 0.01)
    })

    it("Should zoom in properly to high threshold", () => {
      canvasModel.wheelDirection(Array(23).fill(WheelDirection.top))

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 3, 0.01)
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

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.9, 0.01)
    })

    it("Should zoom with move properly", () => {
      canvasModel.dnd(350, 350, 450, 450)
      canvasModel.wheel(WheelDirection.bottom)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.95, 0.01)
      checkCanvasPosition(115, 65)
      checkCanvasOriginPosition(285, 240)
    })
  })
})
