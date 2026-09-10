import { HomePage } from '../../../support/pages/HomePage'

const homePage = new HomePage()

const generateContactData = (testType) => {
  const timestamp = Date.now()

  return {
    name: `Michael QA ${timestamp}`,
    email: `qa.contact+${timestamp}@example.com`,
    phone: '61234567890',
    subject: `${testType} ${timestamp}`,
    message: `${testType} validation message ${timestamp}`
  }
}

describe('Known Defects - Public Contact Form', () => {

  // Known defect: SMB-155 - The contact form provides no error feedback when the message service fails.
  it('TC60 - Verificar feedback del formulario ante un error del servicio [SMB-155]', () => {
    const contactData = generateContactData('Service error test')

    cy.intercept('POST', '**/api/message', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error'
      }
    }).as('messageError')

    cy.visit('/')

    homePage.fillContactForm(contactData)
    homePage.submitContactForm()

    cy.wait('@messageError')
      .its('response.statusCode')
      .should('eq', 500)

    homePage.getContactSection()
      .should('not.contain.text', 'Thanks for getting in touch')

    // The user should receive visible feedback explaining that the submission failed.
    cy.get('#contact .alert-danger')
      .should('be.visible')
      .and('not.be.empty')
  })

  const invalidFormatCases = [
    {
      field: 'email',
      value: 'jh@h'
    },
    {
      field: 'phone',
      value: 'asdfghjklñzxcvbnm'
    }
  ]

  invalidFormatCases.forEach((invalidCase) => {

    // Known defect: SMB-42 - The contact form accepts and stores invalid data.
    it(`TC62 - Verificar rechazo de formato inválido en ${invalidCase.field} [SMB-42]`, () => {
      const contactData = generateContactData('Invalid format test')

      contactData[invalidCase.field] = invalidCase.value

      cy.intercept('POST', '**/api/message').as('createMessage')

      cy.visit('/')

      homePage.fillContactForm(contactData)
      homePage.submitContactForm()

      // Invalid data should be rejected by the backend.
      cy.wait('@createMessage')
        .its('response.statusCode')
        .should('eq', 400)

      homePage.getContactSection()
        .should('not.contain.text', 'Thanks for getting in touch')
        .and('be.visible')
    })
  })
})