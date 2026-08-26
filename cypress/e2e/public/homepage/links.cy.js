describe('Public Links', () => {

    // Related defect: SMB-125 - Footer Quick Links do not redirect to their expected destinations
    it('TC56 - Verificar que los Quick Links del footer disponen de un destino válido [SMB-125]', () => {

        cy.visit('/')

        const quickLinks = [
            { name: 'Home', expectedHref: '/' },
            { name: 'Rooms', expectedHref: '/#rooms' },
            { name: 'Booking', expectedHref: '/#booking' },
            { name: 'Contact', expectedHref: '/#contact' },
        ]

        quickLinks.forEach((link) => {

            cy.get('footer').contains('a', link.name).should('have.attr', 'href', link.expectedHref)
        })
    })

    // Related defect: SMB-39 - Social media icons do not redirect to their corresponding platforms
    it('TC56 - Verificar que los enlaces de redes sociales disponen de un destino válido [SMB-39]', () => {

        cy.visit('/')

        const socialLinks = [
            'bi-facebook',
            'bi-instagram',
            'bi-twitter'
        ]

        socialLinks.forEach((socialIcon) => {

            // Find each social media icon and verify that its parent link
            // has a real destination instead of an empty or placeholder href
            cy.get(`footer i.${socialIcon}`)
                .should('exist')
                .parent('a')
                .should('have.attr', 'href')
                .and('not.be.oneOf', ['', '#'])

        })
    })

    it('TC57 - Verificar que los enlaces internos y anchors apuntan a destinos existentes [SMB-119]', () => {

        cy.visit('/')

        const internalLinks = [
            { name: 'Rooms', href: '/#rooms', target: '#rooms' },
            { name: 'Booking', href: '/#booking', target: '#booking' },
            { name: 'Amenities', href: '/#amenities', target: '#amenities' },
            { name: 'Location', href: '/#location', target: '#location' },
            { name: 'Contact', href: '/#contact', target: '#contact' }
        ]

        internalLinks.forEach((link) => {

            cy.get('nav.navbar').contains('a.nav-link', link.name).should('have.attr', 'href', link.href)
            
            cy.get(link.target).should('exist')
        })
    })
})