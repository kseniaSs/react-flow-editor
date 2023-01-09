import { selectors } from "../../../models"
import { coordinatesFromPath } from "../helpers"
import { connectionsModel } from "./Connections.model"

context("Node connections", () => {
  beforeEach(connectionsModel.open)

  describe("Connections logic", () => {
    const verifyFirstConnectionInitial = () =>
      connectionsModel
        .getFirstConnectionPath()
        .should("be.equal", "M 15310 15335 C 15210 15335, 15359 15140, 15259 15140")

    it("Should match default connector path", () => {
      verifyFirstConnectionInitial()
    })

    it("Should move connectors", () => {
      connectionsModel.mouseDown(470, 152)
      connectionsModel.getRoot().realMouseMove(470, 152)

      connectionsModel
        .getLastConnectionPath()
        .then(coordinatesFromPath)
        .then((coordinates) => {
          const properCoordinates = [15253, 15136, 15153, 15136, 15359, 15140, 15259, 15140]

          coordinates.forEach((coord, inx) => expect(coord).to.closeTo(properCoordinates[inx], 2))
        })

      connectionsModel.getRoot().realMouseMove(530, 330)
      connectionsModel.mouseUp(530, 330)

      verifyFirstConnectionInitial()
    })

    it("Should disconnect/connect connectors", () => {
      connectionsModel.getConnections().then(($cons) => expect($cons.length).to.equal(3))

      connectionsModel.mouseDown(470, 152)
      connectionsModel.getRoot().realMouseMove(480, 170)
      connectionsModel.mouseUp(480, 170)

      connectionsModel.getConnections().then(($cons) => expect($cons.length).to.equal(2))

      connectionsModel.mouseDown(470, 152)
      connectionsModel.getRoot().realMouseMove(530, 330)
      connectionsModel.mouseUp(530, 330)

      connectionsModel.getConnections().then(($cons) => expect($cons.length).to.equal(3))

      verifyFirstConnectionInitial()
    })

    it("Should drag connection via autoscroll", () => {
      connectionsModel.mouseDown(470, 152)
      connectionsModel.getRoot().realMouseMove(990, 110).wait(100).realMouseMove(500, 500)

      cy.get(selectors.CONNECTION)
        .last()
        .then(($el) => {
          const rect = $el.get()[0].getBoundingClientRect()

          expect(rect.top).to.closeTo(266, 10)
          expect(rect.left).to.closeTo(105, 10)
          expect(rect.height).to.closeTo(239, 10)
          expect(rect.width).to.closeTo(371, 10)
        })
    })

    it.only("Should disable node without empty inputs", () => {
      connectionsModel.getNodeElement(1).then(($el) => expect($el.hasClass("disabled")).to.equal(false))

      connectionsModel.mouseDown(670, 366)

      connectionsModel.getNodeElement(1).then(($el) => expect($el.hasClass("disabled")).to.equal(true))
    })
  })
})
