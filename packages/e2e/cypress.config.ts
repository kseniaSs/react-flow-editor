/* eslint-disable */

import { defineConfig } from "cypress"

export const getHost = () => (process.env.UNDER_DOCKER ? "http://flow-editor:5173" : "http://localhost:3000")

export default defineConfig({
  projectId: "XXX",
  fileServerFolder: process.env.UNDER_DOCKER ? "./packages/e2e" : "./",
  pageLoadTimeout: 100000,
  modifyObstructiveCode: false,
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: false,
  watchForFileChanges: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    HOST: getHost()
  },
  e2e: {
    baseUrl: getHost(),
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
    async setupNodeEvents(on, config) {
      const getCompareSnapshotsPlugin = require("cypress-image-diff-js/dist/plugin")

      return getCompareSnapshotsPlugin(on, config)
    },
    supportFile: "./cypress/support/index.ts"
  }
})
