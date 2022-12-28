/* eslint-disable */
import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "XXX",
  fileServerFolder: process.env.UNDER_DOCKER ? "./packages/e2e" : "./",
  pageLoadTimeout: 100000,
  modifyObstructiveCode: false,
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: false,
  watchForFileChanges: true,
  e2e: {
    baseUrl: `http://${process.env.UNDER_DOCKER ? "172.17.0.1:5173" : "localhost:3000"}/`,
    async setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--window-size=1920,1080")
          launchOptions.args.push("--force-device-scale-factor=1")

          return launchOptions
        }
      })
    },
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
    supportFile: process.env.UNDER_DOCKER ? "./packages/e2e/cypress/support/index.ts" : "./cypress/support/index.ts"
  }
})
