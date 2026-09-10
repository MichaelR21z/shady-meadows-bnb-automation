const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  reporter: 'cypress-mochawesome-reporter',

  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Shady Meadows B&B - Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false
  },

  e2e: {
    baseUrl: "https://automationintesting.online",

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    }
  }
})