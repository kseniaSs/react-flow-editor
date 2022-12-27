export class RootModel {
  open(): void {
    cy.visit("http://localhost:3000/")
  }
}
