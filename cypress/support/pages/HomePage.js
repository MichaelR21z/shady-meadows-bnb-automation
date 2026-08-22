export class HomePage {
    // Homepage branding and public hotel information

    verifyHotelName() {
        cy.get('.navbar-brand span').should('be.visible').and('have.text', 'Shady Meadows B&B')
    }

    verifyHeroImage() {
        cy.get('[style*="/images/rbp-logo.jpg"]').should('be.visible').and('have.css', 'background-image').and('include', '/images/rbp-logo.jpg')
    }

    verifyHotelDescription() {
        cy.contains('p.lead',
            'Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.')
    }

    verifyLocationContactInformation() {
        cy.get('#location').within(() => {
            cy.contains('h5', 'Address').should('be.visible')
            cy.contains('Shady Meadows B&B, Shadows valley, Newingtonfordburyshire, Dilbery, N1 1AA').should('be.visible')

            cy.contains('h5', 'Phone').should('be.visible')
            cy.contains('012345678901').should('be.visible')

            cy.contains('h5', 'Email').should('be.visible')
            cy.contains('fake@fakeemail.com').should('be.visible')
        })
    }

    verifyLocationMap() {
        cy.get('#location').scrollIntoView().within(() => {
            cy.get('.pigeon-tiles-box').should('be.visible')
            cy.get('.pigeon-overlays').should('exist')
            cy.get('.pigeon-attribution').should('be.visible')
        })
    }

    verifyFooterContactInformation() {
        cy.get('footer').within(() => {
            cy.contains('Shady Meadows B&B, Shadows valley, Newingtonfordburyshire, Dilbery, N1 1AA').should('be.visible')

            cy.contains('012345678901').should('be.visible')

            cy.contains('fake@fakeemail.com').should('be.visible')
        })
    }

    //----------------------------------------------------------------------

    // Compare homepage branding with the data returned by the branding API.
    
    verifyBrandingAgainstApi(branding) {

        const fullAddress = [
            branding.address.line1,
            branding.address.line2,
            branding.address.postTown,
            branding.address.county,
            branding.address.postCode
        ].join(', ')    // join lo convierte en Shady Meadows B&B, Shadows valley, Newingtonfordburyshire, Dilbery, N1 1AA

        // Name
        
        cy.get('.navbar-brand span').should('be.visible').and('have.text', branding.name)

        // Background image

        cy.get(`[style*="${branding.logoUrl}"]`)
            .should('be.visible')
            .and('have.css', 'background-image')
            .and('include', branding.logoUrl)

        // Description Hero

        cy.contains('p.lead', branding.description).should('be.visible')

        // We can't read the coordinates directly from the DOM
        // Just verify that the map component is rendered
        
        cy.get('#location').scrollIntoView().within(() => {
            cy.get('.pigeon-tiles-box').should('be.visible')

            cy.get('.pigeon-overlays').should('exist')
            
        })

        // Section Location

        cy.get('#location').within(() => {
            cy.contains(fullAddress).should('be.visible')

            cy.contains(branding.contact.phone).should('be.visible')

            cy.contains(branding.contact.email).should('be.visible')

            cy.contains(branding.directions).should('be.visible')

        })

        cy.get('footer').within(() => {
            cy.contains(fullAddress).should('be.visible')

            cy.contains(branding.contact.phone).should('be.visible')

            cy.contains(branding.contact.email).should('be.visible')

        })

    }

    //----------------------------------------------------------------------


    fillReservationForm(guest) {

        cy.get('form').within(() => {
            cy.get('input[name="firstname"]').type(guest.firstname)
            cy.get('input[name="lastname"]').type(guest.lastname)
            cy.get('input[name="email"]').type(guest.email)
            cy.get('input[name="phone"]').type(guest.phone)

            cy.get('button').contains('Reserve Now').click()
        })
    }

    searchAvailability(checkInDate, checkOutDate) {

        // Select booking dates
        cy.get('#booking').within(() => {
            cy.get('h3').should('have.text', 'Check Availability & Book Your Stay')

            cy.get('input.form-control').as('dateInputs')

            // Enter and verify the check-in date
            cy.get('@dateInputs')
                .first()
                .clear()
                .type(`${checkInDate}{enter}`)
                .should('have.value', checkInDate)


            // Enter and verify the check-out date
            cy.get('@dateInputs')
                .eq(1)
                .clear()
                .type(`${checkOutDate}{enter}`)
                .should('have.value', checkOutDate)

            // Click "Check Availability" to filter rooms for the selected dates
            cy.get('button').should('have.text', 'Check Availability').click()
        })

        // Ensure that at least one room is available
        cy.get('#rooms .row > div').should('have.length.greaterThan', 0)
    }

    // Extract the room ID directly from the reservation link.
    // Using the real room identifier makes the test independent
    // of the room name shown in the UI and automatically supports
    // any new rooms added in the future.
    getFirstAvailableRoomId() {

        cy.get('#rooms .row > div')
            .eq(0)
            .find('a.btn-primary')
            .as('bookNowButton')

        return cy.get('@bookNowButton').invoke('attr', 'href').then((reservationUrl) => {

            const roomId = Number(
                reservationUrl.match(/\/reservation\/(\d+)/)[1]
            )

            expect(roomId).to.be.a('number')

            return cy.wrap(roomId)
        })
    }

    searchAndOpenReservationForm(checkInDate, checkOutDate) {
        this.searchAvailability(checkInDate, checkOutDate)

        return this.getFirstAvailableRoomId().then(() => {
            this.openReservationForm()
        })
    }

    openReservationForm() {

        cy.get('@bookNowButton').click()

        cy.get('#doReservation').click()
    }
}
