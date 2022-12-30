import { connectionsModel } from "./Connections.model"

context("Node connections", () => {
  beforeEach(connectionsModel.open)

  describe("Connections without autoscroll", () => {
    const verifyFirstConnectionInitial = () =>
      connectionsModel
        .getFirstConnectionPath()
        .should("be.equal", "M 15310 15335 C 15210 15335, 15359 15140, 15259 15140")

    it("Should move connectors", () => {
      verifyFirstConnectionInitial()

      connectionsModel.getRoot().realMouseDown({ position: { x: 470, y: 152 } })
      connectionsModel.getRoot().realMouseMove(471, 153)

      connectionsModel
        .getLastConnectionPath()
        .should(
          "be.equal",
          "M 15254.75390625 15137.003908157349 C 15154.75390625 15137.003908157349, 15359 15140, 15259 15140"
        )

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
