import { coordinatesFromMatrix } from "../helpers"
import { canvasModel } from "./Canvas.model"
import { CANVAS_CONTEXT } from "./constants"

context(CANVAS_CONTEXT, () => {
  beforeEach(canvasModel.open)

  describe("Movements without autoscroll", () => {
    const matchEndPosition = () =>
      canvasModel
        .canvasPosition()
        .then(coordinatesFromMatrix)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(115, 1)
          expect(Number(y)).to.be.closeTo(65, 1)
        })

    it("Should match default position", () => {
      canvasModel
        .canvasPosition()
        .then(coordinatesFromMatrix)
        .then(([x, y]) => {
          expect(Number(x)).to.be.closeTo(15, 1)
          expect(Number(y)).to.be.closeTo(-35, 1)
        })
    })

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
})
