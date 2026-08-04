// Import commands.js using ES2015 syntax:
import './commands'

// Ignore the known React issue to avoid unrelated test failures.
Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('Minified React error #418')) {
        return false
    }
})