describe('Known Defects - Public Links', () => {
    
    // Known defect: SMB-125 - Footer Quick Links have invalid destinations.
    it('TC56-A - Verificar que los Quick Links del footer disponen de un destino válido [SMB-125]', () => {
        cy.visit('/')

        const quickLinks = [
            { name: 'Home', expectedHref: '/' },
            { name: 'Rooms', expectedHref: '/#rooms' },
            { name: 'Booking', expectedHref: '/#booking' },
            { name: 'Contact', expectedHref: '/#contact' }
        ]

        quickLinks.forEach((link) => {
            cy.get('footer')
                .contains('a', link.name)
                .should('have.attr', 'href', link.expectedHref)
        })
    })

    // Known defect: SMB-39 - Social media links use placeholder destinations.
    it('TC56-B - Verificar que los enlaces de redes sociales disponen de un destino válido [SMB-39]', () => {
        cy.visit('/')

        const socialLinks = [
            'bi-facebook',
            'bi-instagram',
            'bi-twitter'
        ]

        socialLinks.forEach((socialIcon) => {
            // Verify that each social link has a real destination.
            cy.get(`footer i.${socialIcon}`)
                .should('exist')
                .parent('a')
                .should('have.attr', 'href')
                .and('not.be.oneOf', ['', '#'])
                .and('match', /^https?:\/\//)
        })
    })

    // Known defect: SMB-119 - The Amenities link targets a section that does not exist.
    it('TC57 - Verificar que los enlaces internos apuntan a secciones existentes [SMB-119]', () => {
        cy.visit('/')

        const internalLinks = [
            { name: 'Rooms', href: '/#rooms', target: '#rooms' },
            { name: 'Booking', href: '/#booking', target: '#booking' },
            { name: 'Amenities', href: '/#amenities', target: '#amenities' },
            { name: 'Location', href: '/#location', target: '#location' },
            { name: 'Contact', href: '/#contact', target: '#contact' }
        ]

        internalLinks.forEach((link) => {
            cy.get('nav.navbar')
                .contains('a.nav-link', link.name)
                .should('have.attr', 'href', link.href)

            cy.get(link.target).should('exist')
        })
    })
})