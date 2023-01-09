import { RootModel, selectors } from "../../../models"

export class ConnectionsModel extends RootModel {
  getFirstConnectionPath() {
    return cy
      .get(selectors.CONNECTION)
      .first()
      .then(($el) => $el.attr("d"))
  }
  getLastConnectionPath() {
    return cy
      .get(selectors.CONNECTION)
      .last()
      .then(($el) => $el.attr("d") as string)
  }
  getConnections() {
    return cy.get(selectors.CONNECTION)
  }
  getNodeElement(nodeNum: number) {
    return connectionsModel.getNode(nodeNum).find(selectors.NODE_ELEMENT)
  }
}

export const connectionsModel = new ConnectionsModel()
