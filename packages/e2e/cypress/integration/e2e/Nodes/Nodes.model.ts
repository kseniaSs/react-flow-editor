import { RootModel } from "../../../models"
import { coordinatesFromMatrix } from "../helpers"

export class NodesModel extends RootModel {
  nodePosition(nodeNumber: number) {
    return this.getNode(nodeNumber).then(($el) => $el.css("transform"))
  }
  nodeClick(nodeNumber: number) {
    return this.getNode(nodeNumber).realClick()
  }
  nodePositionNumeric(nodeNumber: number) {
    return this.nodePosition(nodeNumber).then(coordinatesFromMatrix)
  }
}

export const nodesModel = new NodesModel()
