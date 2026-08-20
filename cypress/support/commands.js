// Logs in through the API using credentials stored in Cypress environment variables
// Stores the authentication token as a cookie for subsequent authenticated requests

Cypress.Commands.add('loginAPI', (username = Cypress.env('adminUsername'), password = Cypress.env('adminPassword')) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/api/auth/login`,
      body: {
        username,
        password
      }
    }).then((response) => {

      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('token')

      return response.body.token
    })
  })

Cypress.Commands.add('loginUI', (username, password) => {
    cy.visit('/')

    cy.get('#navbarNav > .navbar-nav > li').last().click()
    
    cy.get('form').within(() => {
        cy.get('input[type="text"]').type(username)
        cy.get('input[type="password"]').type(password)
        cy.get('button[type="submit"]').click()
    })
})

Cypress.Commands.add('validateToken', (token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/api/auth/validate`,
    failOnStatusCode: false,
    body: {
      token
    }
  })
})