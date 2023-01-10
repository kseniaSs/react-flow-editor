import { CONTEXT } from "./constants"
import { nodesModel } from "./Nodes.model"

context(CONTEXT, () => {
  beforeEach(nodesModel.open)

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
})
