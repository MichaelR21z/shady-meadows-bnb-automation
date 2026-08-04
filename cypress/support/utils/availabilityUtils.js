import { findAvailableDateRange } from './bookingUtils'

export const verifyAvailabilityConsistency = (roomId) => {

    const baseUrl = Cypress.config('baseUrl')

    // Create a booking using dates that are guaranteed not to
    // overlap with existing reservations. This avoids random
    // 409 Conflict responses caused by previous test data.
    return findAvailableDateRange(roomId).then((dates) => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/booking`,
            body: {
                roomid: roomId,
                firstname: 'Conflict',
                lastname: 'Tester',
                depositpaid: false,
                email: 'conflict.tester@example.com',
                phone: '01234567890',
                bookingdates: {
                    checkin: dates.bookingCheckIn,
                    checkout: dates.bookingCheckOut
                }
            }
        }).then((response) => {
            expect(response.status).to.eq(201)
        })

        // Search using an overlapping date range.
        // If SMB-72 exists, the room will incorrectly appear
        // as available even though it already has a booking.
        cy.get('#booking').within(() => {

            cy.get('input.form-control').as('dateInputs')

            cy.get('@dateInputs')
                .first()
                .clear()
                .type(`${dates.searchCheckIn}{enter}`)

            cy.get('@dateInputs')
                .eq(1)
                .clear()
                .type(`${dates.searchCheckOut}{enter}`)

            cy.contains('button', 'Check Availability').click()
        })

        // The booked room should not be listed as available.
        // This assertion documents SMB-72 and is expected to fail
        // until the availability calculation is fixed.
        cy.get('#rooms .row > div a.btn-primary').should(($links) => {

            const roomLinks = [...$links].map(link =>
                link.getAttribute('href')
            )

            const roomIsListed = roomLinks.some(href =>
                href.startsWith(`/reservation/${roomId}?`)
            )

            expect(
                roomIsListed,
                `Room ${roomId} should not be listed as available for overlapping dates`
            ).to.be.false
        })
    })
}