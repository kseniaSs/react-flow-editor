import { RootModel } from "../../../models"

export class NodesModel extends RootModel {
  nodePosition(nodeNumber: number) {
    return this.getNode(nodeNumber).then(($el) => $el.css("transform"))
  }
}

export const nodesModel = new NodesModel()
