import { RootModel, selectors } from "../../../models"

export class NodesModel extends RootModel {
  getNode(nodeNumber: number) {
    return cy.get(selectors.SINGLE_NODE + nodeNumber)
  }
  nodePosition(nodeNumber: number) {
    return this.getNode(nodeNumber).then(($el) => $el.css("transform"))
  }
}

export const nodesModel = new NodesModel()
