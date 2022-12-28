/* eslint-disable */
import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "XXX",
  fileServerFolder: process.env.UNDER_DOCKER ? "./packages/e2e" : "./",
  pageLoadTimeout: 100000,
  modifyObstructiveCode: false,
  chromeWebSecurity: false,
  video: false,
  watchForFileChanges: true,
  e2e: {
    baseUrl: `http://host.docker.internal:5173/`,
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
