import { RootModel, selectors } from "../../../models"

export class ConnectionsModel extends RootModel {
  getFirstConnectionPath() {
    return cy
      .get(selectors.CONNECTION)
      .first()
      .then(($el) => $el.attr("d") as string)
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
}

export const connectionsModel = new ConnectionsModel()
