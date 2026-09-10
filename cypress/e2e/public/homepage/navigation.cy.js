describe('Homepage Navigation', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    const workingHeaderLinks = [
        { name: 'Rooms', href: '/#rooms', section: '#rooms' },
        { name: 'Booking', href: '/#booking', section: '#booking' },
        { name: 'Location', href: '/#location', section: '#location' },
        { name: 'Contact', href: '/#contact', section: '#contact' }
    ]

    it('TC42-A - Verificar navegación mediante los enlaces funcionales del header', () => {
        workingHeaderLinks.forEach((link) => {
            cy.get('nav.navbar')
                .contains('a.nav-link', link.name)
                .should('have.attr', 'href', link.href)
                .click()

            cy.location('hash').should('eq', link.section)

            cy.get(link.section)
                .should('exist')
                .and('be.visible')

            cy.visit('/')
        })

        cy.get('nav.navbar')
            .contains('a.nav-link', 'Admin')
            .should('have.attr', 'href', '/admin')
            .click()

        cy.location('pathname').should('eq', '/admin')
    })

    it('TC43 - Verificar visibilidad de las secciones al navegar desde el header', () => {
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

            cy.location('hash').should('eq', section.selector)

            cy.get(section.selector).should('be.visible')
        })
    })
})