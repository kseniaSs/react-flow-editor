import { coordinatesFromPath } from "../helpers"
import { connectionsModel } from "./Connections.model"

context("Node connections", () => {
  beforeEach(connectionsModel.open)

  describe("Connections without autoscroll", () => {
    const verifyFirstConnectionInitial = () =>
      connectionsModel
        .getFirstConnectionPath()
        .should("be.equal", "M 15310 15335 C 15210 15335, 15359 15140, 15259 15140")

    it("Should match default connector path", () => {
      verifyFirstConnectionInitial()
    })

    it("Should move connectors", () => {
      connectionsModel.getRoot().realMouseDown({ position: { x: 470, y: 152 } })
      connectionsModel.getRoot().realMouseMove(470, 152)

      connectionsModel
        .getLastConnectionPath()
        .then(coordinatesFromPath)
        .then((coordinates) => {
          const properCoordinates = [15253, 15136, 15153, 15136, 15359, 15140, 15259, 15140]

          coordinates.forEach((coord, inx) => expect(coord).to.closeTo(properCoordinates[inx], 2))
        })

      connectionsModel.getRoot().realMouseMove(530, 330)
      connectionsModel.getRoot().realMouseUp({ position: { x: 530, y: 330 } })

      verifyFirstConnectionInitial()
    })

    it("Should disconnect/connect connectors", () => {
      connectionsModel.getConnections().then(($cons) => expect($cons.length).to.equal(3))

      connectionsModel.getRoot().realMouseDown({ position: { x: 470, y: 152 } })
      connectionsModel.getRoot().realMouseMove(480, 170)
      connectionsModel.getRoot().realMouseUp({ position: { x: 480, y: 170 } })

      connectionsModel.getConnections().then(($cons) => expect($cons.length).to.equal(2))

      connectionsModel.getRoot().realMouseDown({ position: { x: 470, y: 152 } })
      connectionsModel.getRoot().realMouseMove(530, 330)
      connectionsModel.getRoot().realMouseUp({ position: { x: 530, y: 330 } })

      connectionsModel.getConnections().then(($cons) => expect($cons.length).to.equal(3))

      verifyFirstConnectionInitial()
    })
  })
})
