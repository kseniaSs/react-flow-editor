import { WheelDirection } from "../constants"
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
      expect(Number(x)).to.closeTo(160, 1)
      expect(Number(y)).to.closeTo(160, 1)
    }

    it("Should single node move correctly", () => {
      nodesModel.dnd(350, 150, 400, 200)

      nodesModel.nodePosition(1).then(coordinatesFromMatrix).then(verifyEndNodePoint)

      nodesModel.dnd(550, 350, 400, 200)

      nodesModel.nodePosition(2).then(coordinatesFromMatrix).then(verifyEndNodePoint)
    })

    it("Should multiple node movements correctly", () => {
      nodesModel.dnd(350, 150, 400, 200)
      nodesModel.dnd(350, 150, 450, 150)
      nodesModel.dnd(450, 150, 400, 250)
      nodesModel.dnd(400, 250, 400, 200)

      nodesModel.nodePosition(1).then(coordinatesFromMatrix).then(verifyEndNodePoint)
    })
  })

  describe("Selections", () => {
    it("Should be not selected on init", () => {
      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(false))
    })

    it("Should select nodes on click", () => {
      nodesModel.nodeClick(1)

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(true))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(false))
    })

    it("Should select nodes on click chain", () => {
      nodesModel.nodeClick(1)

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(true))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(false))

      nodesModel.nodeClick(2)

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(false))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(true))
    })

    it("Should select nodes on click multiple", () => {
      nodesModel.nodeClick(1)
      nodesModel.getNode(2).click({ shiftKey: true })

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(true))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(true))

      nodesModel.nodeClick(1)

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(true))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(false))
    })

    it("Should move multiple selected nodes", () => {
      nodesModel.nodeClick(1)
      nodesModel.getNode(2).click({ shiftKey: true })

      nodesModel.getNode(1).trigger("mousedown", { shiftKey: true, button: 0 })
      nodesModel.getRoot().trigger("mousemove", { clientX: 400, clientY: 200 })
      nodesModel.getNode(1).trigger("mouseup", { button: 0 })

      nodesModel.nodePositionNumeric(1).then(([x, y]) => {
        expect(Number(x)).to.closeTo(111, 1)
        expect(Number(y)).to.closeTo(231, 1)
      })

      nodesModel.nodePositionNumeric(2).then(([x, y]) => {
        expect(Number(x)).to.closeTo(311, 1)
        expect(Number(y)).to.closeTo(431, 1)
      })
    })

    it("Should select by selection zone", () => {
      nodesModel.getRoot().trigger("mousedown", { shiftKey: true, button: 0, clientX: 210, clientY: 60 })
      nodesModel.getRoot().trigger("mousemove", { clientX: 330, clientY: 200 })

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(true))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(false))

      nodesModel.getRoot().trigger("mousemove", { clientX: 530, clientY: 400 })
      nodesModel.getRoot().trigger("mouseup", { button: 0, clientX: 530, clientY: 400 })

      nodesModel.getNodeElement(1).then(($el) => expect($el.hasClass("selected")).to.equals(true))
      nodesModel.getNodeElement(2).then(($el) => expect($el.hasClass("selected")).to.equals(true))
    })
  })

  describe("Movements with autoscroll", () => {
    it("Should autoscroll top", () => {
      nodesModel.dndWithDelayUp(350, 150, 400, 50)
      nodesModel.nodePositionNumeric(1).then(([_, y]) => expect(Number(y)).to.be.lessThan(0))
    })

    it("Should autoscroll right", () => {
      nodesModel.dndWithDelayUp(350, 150, 999, 300)

      nodesModel.nodePositionNumeric(1).then(([x]) => expect(Number(x)).to.be.greaterThan(800))
    })

    it("Should autoscroll bottom", () => {
      nodesModel.dndWithDelayUp(350, 150, 350, 659)

      nodesModel.nodePositionNumeric(1).then(([_, y]) => expect(Number(y)).to.be.greaterThan(610))
    })

    it("Should autoscroll left", () => {
      nodesModel.dndWithDelayUp(350, 150, 240, 200)

      nodesModel.nodePositionNumeric(1).then(([x]) => expect(Number(x)).to.be.lessThan(0))
    })

    it("Should autoscroll two direction at corners", () => {
      nodesModel.dndWithDelayUp(350, 150, 990, 100)

      nodesModel.nodePositionNumeric(1).then(([x, y]) => {
        expect(Number(y)).to.be.lessThan(0)
        expect(Number(x)).to.be.greaterThan(800)
      })
    })

    it("Should autoscroll with zoom", () => {
      nodesModel.wheelDirection(Array(23).fill(WheelDirection.bottom))
      nodesModel.dndWithDelayUp(520, 295, 990, 100)

      nodesModel.nodePositionNumeric(1).then(([x, y]) => {
        expect(Number(y)).to.be.lessThan(0)
        expect(Number(x)).to.be.greaterThan(800)
      })
    })
  })
})
