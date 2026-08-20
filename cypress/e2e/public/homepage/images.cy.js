describe('Imágenes de la homepage', () => {
    it('TC54 - Verificar comportamiento de la aplicación cuando una imagen no puede cargarse', () => {

        // Intercept the image request and simulate a 404 Not Found response.        
        cy.intercept('GET', '/images/rbp-logo.jpg', {
            statusCode: 404,
            body: 'Not Found'
        }).as('image404')

        cy.visit('/')

        cy.wait('@image404')
            .its('response.statusCode')
            .should('eq', 404)

        // Verify that the homepage remains visible after the image fails to load.
        cy.get('body').should('be.visible')

        // Verify that the main homepage sections remain visible and accessible.
        const sections = ['.hero', '#booking', '#rooms', '#location', '#contact']

        sections.forEach((section) => {
            cy.get(section)
                .scrollIntoView()
                .should('be.visible')
            cy.wait(500)
        })
    })
})