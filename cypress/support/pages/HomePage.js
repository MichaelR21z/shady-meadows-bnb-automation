export class HomePage {
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
