describe('Known Defects - Homepage Navigation', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    // Known defect: SMB-119 - The Amenities link targets a section that does not exist.
    it('TC42-B - Verificar navegación hacia la sección Amenities [SMB-119]', () => {
        cy.get('nav.navbar')
            .contains('a.nav-link', 'Amenities')
            .should('have.attr', 'href', '/#amenities')
            .click()

        cy.location('hash').should('eq', '#amenities')

        cy.get('#amenities')
            .should('exist')
            .and('be.visible')
    })

    // Known defect: SMB-121 - The 404 page does not provide a navigation option.
    it('TC44 - Verificar navegación desde una página inexistente [SMB-121]', () => {
        cy.visit('/non-existent-route', {
            failOnStatusCode: false
        })

        cy.contains('404').should('be.visible')
        cy.contains('This page could not be found.').should('be.visible')

        cy.get('a[href="/"]')
            .should('be.visible')
            .click()

        cy.location('pathname').should('eq', '/')
    })

    // Known defect: SMB-125 - Footer Quick Links have invalid destinations.
    it('TC46 - Verificar navegación mediante los enlaces del footer [SMB-125]', () => {
        const footerLinks = [
            { name: 'Home', href: '/', pathname: '/' },
            { name: 'Rooms', href: '/#rooms', section: '#rooms' },
            { name: 'Booking', href: '/#booking', section: '#booking' },
            { name: 'Contact', href: '/#contact', section: '#contact' }
        ]

        footerLinks.forEach((link) => {
            cy.get('footer')
                .contains('a', link.name)
                .should('be.visible')
                .and('have.attr', 'href', link.href)
                .click()

            if (link.section) {
                cy.location('hash').should('eq', link.section)

                cy.get(link.section).should('be.visible')
            } else {
                cy.location('pathname').should('eq', link.pathname)
            }

            cy.visit('/')
        })
    })
})