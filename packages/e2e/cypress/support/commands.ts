/* eslint-disable */
// @ts-nocheck
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable {
    compareSnapshot(name?: string, threshold?: number): void
  }
}

const compareSnapshot = require("cypress-image-diff-js/dist/command")
compareSnapshot()
/* eslint-enable */
