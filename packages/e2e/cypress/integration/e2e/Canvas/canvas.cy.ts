import { WheelDirection } from "../constants"
import { coordinatesFromMatrix, coordinatesFromStringPX, zoomFromMatrix } from "../helpers"
import { canvasModel } from "./Canvas.model"
import { CANVAS_CONTEXT } from "./constants"

context(CANVAS_CONTEXT, () => {
  beforeEach(canvasModel.open)

  describe("Initializing", () => {
    it("Should match default position", () => {
      canvasModel
        .canvasPosition()
        .then(coordinatesFromMatrix)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(15, 1)
          expect(Number(y)).to.be.closeTo(-35, 1)
        })

      canvasModel
        .canvasPositionOrigin()
        .then(coordinatesFromStringPX)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(385, 1)
          expect(Number(y)).to.be.closeTo(340, 1)
        })
    })
  })

  describe("Movements DnD", () => {
    const matchEndPosition = () => {
      canvasModel
        .canvasPosition()
        .then(coordinatesFromMatrix)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(115, 1)
          expect(Number(y)).to.be.closeTo(65, 1)
        })

      canvasModel
        .canvasPositionOrigin()
        .then(coordinatesFromStringPX)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(285, 1)
          expect(Number(y)).to.be.closeTo(240, 1)
        })
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

  describe.only("Zoom interactions", () => {
    it("Should zoom out properly once", () => {
      canvasModel.wheel(WheelDirection.bottom)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.95, 0.01)
    })

    it("Should zoom out properly multiple", () => {
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.bottom)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.86, 0.01)
    })

    it("Should zoom out properly to low threshold", () => {
      for (let i = 0; i < 40; i++) {
        canvasModel.wheel(WheelDirection.bottom)
      }

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.2, 0.01)
    })

    it("Should zoom in properly once", () => {
      canvasModel.wheel(WheelDirection.top)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 1.05, 0.01)
    })

    it("Should zoom in properly multiple", () => {
      canvasModel.wheel(WheelDirection.top)
      canvasModel.wheel(WheelDirection.top)
      canvasModel.wheel(WheelDirection.top)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 1.15, 0.01)
    })

    it("Should zoom in properly to high threshold", () => {
      for (let i = 0; i < 23; i++) {
        canvasModel.wheel(WheelDirection.top)
      }

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 3, 0.01)
    })

    it("Should zoom properly bidirectionally", () => {
      canvasModel.wheel(WheelDirection.top)
      canvasModel.wheel(WheelDirection.top)
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.bottom)
      canvasModel.wheel(WheelDirection.top)

      canvasModel.canvasPosition().then(zoomFromMatrix).should("be.closeTo", 0.9, 0.01)
    })
  })
})
