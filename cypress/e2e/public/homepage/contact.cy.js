import { HomePage } from '../../../support/pages/HomePage'

const homePage = new HomePage()

// Generate unique contact data for each test execution.
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

describe('Public Contact Form', () => {

    it('TC58 - Verificar envío exitoso del formulario de contacto con datos válidos', () => {

        const contactData = generateContactData('Contact test')

        // Capture the message creation request triggered from the UI.
        cy.intercept('POST', '**/api/message').as('createMessage')

        cy.visit('/')

        // Fill and submit the contact form with unique valid data.
        homePage.fillContactForm(contactData)
        homePage.submitContactForm()

        // Verify that the backend accepts and processes the message successfully.
        cy.wait('@createMessage').then(({ request, response }) => {

            expect(response.statusCode).to.eq(200)
            expect(response.body).to.have.property('success', true)

            expect(request.body.name).to.eq(contactData.name)
            expect(request.body.email).to.eq(contactData.email)
            expect(request.body.phone).to.eq(contactData.phone)
            expect(request.body.subject).to.eq(contactData.subject)
            expect(request.body.description).to.eq(contactData.message)
        })

        // Verify that the application displays the successful submission confirmation.
        homePage.verifyContactSuccessMessage()

        // Verify that the Contact section remains available after submission.
        homePage.getContactSection().should('be.visible')
    })

    it('TC59 - Verificar persistencia y correspondencia del mensaje enviado entre UI y backend', () => {

        const contactData = generateContactData('Persistence test')

        // Capture the message creation request triggered from the UI
        cy.intercept('POST', '**/api/message').as('createMessage')

        cy.visit('/')

        // Complete and submit the contact form using the generated data
        homePage.fillContactForm(contactData)
        homePage.submitContactForm()

        // Verify that the backend confirms the message was created successfully
        cy.wait('@createMessage').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
            expect(response.body).to.have.property('success', true)
        })

        // Retrieve all stored messages to locate the one created by this test
        cy.request('GET', '/api/message').then((response) => {

            expect(response.status).to.eq(200)

            const messages = response.body.messages

            expect(messages).to.be.an('array')

            // Locate the recently created message by comparing its name and subject with the expected test data
            const storedMessage = messages.find((message) => {
                return (
                    message.name === contactData.name &&
                    message.subject === contactData.subject
                )
            })

            expect(storedMessage).to.exist

            // Get the ID assigned by the backend for the matching message
            const messageId = storedMessage.id

            expect(messageId).to.exist

            // Retrieve the complete message using the dynamically obtained ID
            cy.request('GET', `/api/message/${messageId}`).then((detailResponse) => {

                expect(detailResponse.status).to.eq(200)

                const messageDetail = detailResponse.body

                // Compare the stored message with the data submitted from the UI
                expect(messageDetail.messageid).to.eq(messageId)
                expect(messageDetail.name).to.eq(contactData.name)
                expect(messageDetail.email).to.eq(contactData.email)
                expect(messageDetail.phone).to.eq(contactData.phone)
                expect(messageDetail.subject).to.eq(contactData.subject)
                expect(messageDetail.description).to.eq(contactData.message)
            })
        })
    })

    // Related defect: SMB-155 - contact form no error feedback
    // The contact form does not display any error message when the message service returns an error.
    it('TC60 - Verificar comportamiento del formulario de contacto ante un error del servicio', () => {

        const contactData = generateContactData('Service error test')

        cy.intercept('POST', '**/api/message', {
            statusCode: 500,
            body: {
                error: 'Internal Server Error'
            }
        }).as('MessageError')

        cy.visit('/')

        // Complete and submit the contact form using the generated data
        homePage.fillContactForm(contactData)
        homePage.submitContactForm()

        // Verify that the simulated backend response returns HTTP 500.
        cy.wait('@MessageError').its('response.statusCode').should('eq', 500)

        // Verify that a successful submission message is not displayed.
        cy.get('#contact').should('not.contain.text', 'Thanks for getting in touch')

        // Verify that the Contact section remains available after the failed request.
        homePage.getContactSection().scrollIntoView().should('be.visible')

        cy.get('body').should('be.visible')
    })

    it('TC61 - Verificar validación de campos obligatorios del formulario de contacto', () => {

        // Capture the validation response returned when submitting an empty form.
        cy.intercept('POST', '**/api/message').as('createMessage')

        cy.visit('/')

        // Submit the form without completing any required field.
        homePage.submitContactForm()

        // Verify that the backend rejects the empty form submission.
        cy.wait('@createMessage').then(({ response }) => {
            expect(response.statusCode).to.eq(400)
        })

        // Verify that required field validation messages are displayed.
        homePage.getContactSection()
            .should('contain.text', 'Email may not be blank')
            .and('contain.text', 'Phone may not be blank')
            .and('contain.text', 'Message may not be blank')
            .and('contain.text', 'Subject may not be blank')
            .and('contain.text', 'Name may not be blank')

        // Verify that no successful submission confirmation is displayed.
        homePage.getContactSection()
            .should('not.contain.text', 'Thanks for getting in touch')

        // Verify that the Contact section remains available after validation.
        homePage.getContactSection()
            .should('be.visible')
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

        // Related defect: SMB-42 - Contact form accepts invalid data
        it(`TC62 - Verificar rechazo de formato inválido en ${invalidCase.field} [SMB-42]`, () => {

            const contactData = generateContactData('Invalid format test')

            // Replace only the field under validation with an invalid value.
            contactData[invalidCase.field] = invalidCase.value

            // Capture any message creation request triggered by the invalid form.
            cy.intercept('POST', '**/api/message').as('createMessage')


            cy.visit('/')

            // Fill the form with valid data except for the field being validated.
            homePage.fillContactForm(contactData)
            homePage.submitContactForm()

            // Wait for the request incorrectly triggered with invalid data.
            cy.wait('@createMessage')

            // Verify that invalid input does not produce a successful submission.
            homePage.getContactSection()
                .should('not.contain.text', 'Thanks for getting in touch')

            // Verify that the Contact section remains available after validation.
            homePage.getContactSection()
                .should('be.visible')
        })
    })


    // Define the boundary scenarios for each field and the expected submission behavior.
    // shouldSubmit indicates whether each value should be accepted and submitted.

    const boundaryCases = [
        {
            field: 'phone',
            value: '1'.repeat(10),
            shouldSubmit: false,
            expectedError: 'Phone must be between 11 and 21 characters.'
        },
        {
            field: 'phone',
            value: '1'.repeat(11),
            shouldSubmit: true
        },
        {
            field: 'phone',
            value: '1'.repeat(21),
            shouldSubmit: true
        },
        {
            field: 'phone',
            value: '1'.repeat(22),
            shouldSubmit: false,
            expectedError: 'Phone must be between 11 and 21 characters.'
        },
        {
            field: 'subject',
            value: 'A'.repeat(4),
            shouldSubmit: false,
            expectedError: 'Subject must be between 5 and 100 characters.'
        },
        {
            field: 'subject',
            value: 'A'.repeat(5),
            shouldSubmit: true
        },
        {
            field: 'subject',
            value: 'A'.repeat(100),
            shouldSubmit: true
        },
        {
            field: 'subject',
            value: 'A'.repeat(101),
            shouldSubmit: false,
            expectedError: 'Subject must be between 5 and 100 characters.'
        },
        {
            field: 'message',
            value: 'A'.repeat(19),
            shouldSubmit: false,
            expectedError: 'Message must be between 20 and 2000 characters.'
        },
        {
            field: 'message',
            value: 'A'.repeat(20),
            shouldSubmit: true
        },
        {
            field: 'message',
            value: 'A'.repeat(2000),
            shouldSubmit: true
        },
        {
            field: 'message',
            value: 'A'.repeat(2001),
            shouldSubmit: false,
            expectedError: 'Message must be between 20 and 2000 characters.'
        }
    ]

    boundaryCases.forEach((boundaryCase) => {

        it(`TC63 - Verificar límite de ${boundaryCase.field} con ${boundaryCase.value.length} caracteres`, () => {

            const contactData = generateContactData('Boundary test')

            // Replace only the field under validation with the selected boundary value.
            contactData[boundaryCase.field] = boundaryCase.value

            // Capture the message request triggered by the contact form.
            cy.intercept('POST', '**/api/message').as('createMessage')

            cy.visit('/')

            // Fill and submit the form with the selected boundary value.
            homePage.fillContactForm(contactData)
            homePage.submitContactForm()

            if (boundaryCase.shouldSubmit) {

                // Verify that valid boundary values are accepted by the backend.
                cy.wait('@createMessage').then(({ response }) => {
                    expect(response.statusCode).to.eq(200)
                    expect(response.body).to.have.property('success', true)
                })

                homePage.verifyContactSuccessMessage()

            } else {

                // Verify that invalid boundary values are rejected by the backend.
                cy.wait('@createMessage').then(({ response }) => {
                    expect(response.statusCode).to.eq(400)
                })

                // Verify that the corresponding validation message is displayed.
                homePage.getContactSection()
                    .should('contain.text', boundaryCase.expectedError)

                // Verify that invalid boundary values do not produce a successful submission.
                homePage.getContactSection()
                    .should('not.contain.text', 'Thanks for getting in touch')
            }

            // Verify that the Contact section remains available after validation.
            homePage.getContactSection()
                .should('be.visible')
        })
    })
})