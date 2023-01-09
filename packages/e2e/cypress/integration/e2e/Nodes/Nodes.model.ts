import { RootModel } from "../../../models"

export class NodesModel extends RootModel {
  nodePosition(nodeNumber: number) {
    return this.getNode(nodeNumber).then(($el) => $el.css("transform"))
  }
  nodeClick(nodeNumber: number) {
    return this.getNode(nodeNumber).realClick()
  }
}

export const nodesModel = new NodesModel()
