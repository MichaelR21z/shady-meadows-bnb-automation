describe('Homepage Navigation', () => {

    beforeEach(() => {
        cy.visit('/')
    })

    const headerLinks = [
        { name: 'Rooms', href: '/#rooms', section: '#rooms' },
        { name: 'Booking', href: '/#booking', section: '#booking' },
        { name: 'Amenities', href: '/#amenities', section: '#amenities' },
        { name: 'Location', href: '/#location', section: '#location' },
        { name: 'Contact', href: '/#contact', section: '#contact' }
    ]

    // Related defect: SMB-119 - The "Amenities" header link points to a section that does not exist.
    it('TC42 - Verificar navegación mediante los enlaces del header [SMB-119]', () => {

        headerLinks.forEach((link) => {

            cy.get('nav.navbar')
                .contains('a.nav-link', link.name)
                .should('have.attr', 'href', link.href)
                .click()

            cy.url().should('include', link.href)

            cy.get(link.section).should('exist').and('be.visible')

            cy.visit('/')
        })

        cy.get('nav.navbar')
            .contains('a.nav-link', 'Admin')
            .should('have.attr', 'href', '/admin')
            .click()

        cy.url().should('include', '/admin')
    })

    // Note: SMB-120 is a visual layout issue documented with screenshot evidence.
    // This test verifies that header navigation reaches the expected sections.
    it('TC43 - Verificar visibilidad de las secciones al navegar desde el header [SMB-120]', () => {

        const sections = [
            { name: 'Rooms', selector: '#rooms' },
            { name: 'Location', selector: '#location' },
            { name: 'Contact', selector: '#contact' },
            { name: 'Booking', selector: '#booking' }
        ]

        sections.forEach((section) => {
            cy.get('nav.navbar')
                .contains('a.nav-link', section.name)
                .click()

            cy.get(section.selector).should('be.visible')

            // Pause briefly between sections to make the navigation easier to observe during execution.
            // cy.wait(800)
        })
    })

    // Related defect: SMB-121 - The 404 page shows a technical screen without navigation options.
    it('TC44 - Verificar comportamiento al acceder a una ruta inexistente [SMB-121]', () => {

        cy.visit('/non-existent-route', {
            failOnStatusCode: false
        })

        cy.contains('404').should('be.visible')

        cy.contains('This page could not be found.').should('be.visible')

        // Verify that the 404 page provides a navigation option to return to the homepage.
        cy.get('a[href="/"]').should('be.visible').click()
    })

    // Related defect: SMB-125 - The Quick Links footer links do not navigate to their expected destinations.
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
                cy.location('hash')
                    .should('eq', link.section)

                cy.get(link.section)
                    .should('be.visible')
            } else {
                cy.location('pathname')
                    .should('eq', link.pathname)
            }

            cy.visit('/')
        })
    })
})