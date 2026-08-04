describe('Room Reservation', () => {
    // Maps each room type displayed in the UI to its corresponding
    // backend room ID. This allows the reservation created through
    // the UI to be verified later using the Booking API.
    const ROOM_TYPE_TO_ID = {
        'Single Room': 1,
        'Double Room': 2,
        'Suite Room': 3
    }

    // Helper functions to format dates for both the UI (dd/mm/yyyy)
    // and the backend API (yyyy-mm-dd).
    const formatUiDate = (date) => {
        const dd = String(date.getDate()).padStart(2, '0')
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }

    const formatApiDate = (uiDate) => {
        const [day, month, year] = uiDate.split('/')
        return `${year}-${month}-${day}`
    }

    // Generate random booking dates on every execution to avoid
    // conflicts with existing reservations and improve test reliability.
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    // An object is created with the current date and time
    const today = new Date()

    // Random dates in each execution
    const checkInOffset = randomInt(1, 60)
    const nights = randomInt(1, 10)

    // Calculate dynamic check-in and check-out dates based on the
    // current date. JavaScript automatically adjusts the month and
    // year when the resulting day exceeds the number of days in
    // the current month.
    const checkInDate = formatUiDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + checkInOffset))
    const checkOutDate = formatUiDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + checkInOffset + nights))

    // Convert the UI dates (dd/mm/yyyy) into the API format
    // (yyyy-mm-dd) to compare them with the booking endpoint.
    const checkInApi = formatApiDate(checkInDate)
    const checkOutApi = formatApiDate(checkOutDate)

    const searchAndOpenReservationForm = () => {
        // Select booking dates
        cy.get('#booking').within(() => {
            cy.get('h3').should('have.text', 'Check Availability & Book Your Stay')
            cy.get('input.form-control').as('dateInputs')

            // Enter and verify the check-in date
            cy.get('@dateInputs').first().clear().type(`${checkInDate}{enter}`)
            cy.get('@dateInputs').first().should('have.value', checkInDate)

            // Enter and verify the check-out date
            cy.get('@dateInputs').eq(1).clear().type(`${checkOutDate}{enter}`)
            cy.get('@dateInputs').eq(1).should('have.value', checkOutDate)

            // Click "Check Availability" to filter rooms for the selected dates
            cy.get('button').should('have.text', 'Check Availability').click()
        })

        // Ensure that at least one room is available
        cy.get('#rooms .row > div').should('have.length.greaterThan', 0)

        // Read the selected room type from the UI, map it to its backend
        // room ID, and return it to validate the reservation later
        // through the Booking API.
        return cy.get('#rooms .row > div').eq(0).find('img').invoke('attr', 'alt').then((altText) => {
            const roomId = ROOM_TYPE_TO_ID[altText]

            // Fail fast with a clear message if the room type is unknown
            expect(roomId, `Unrecognized room type: "${altText}"`).to.exist

            // Navigate into the room and open the reservation form
            cy.get('#rooms .row > div').eq(0).find('a').click()
            cy.get('#doReservation').click()

            return cy.wrap(roomId)
        })
    }

    beforeEach(() => {
        cy.visit('/')
    })

    context('Happy Path', () => {
        // retries mitigates the known, intermittent 409 Conflict documented
        // in the investigation: a real race condition in the shared demo
        // backend, not a flaw in this test. If it happens, Cypress reruns
        // the whole test (with fresh random dates) up to 2 more times
        // before failing for real.
        it('Should create a room reservation and verify it in the backend', { retries: { runMode: 2, openMode: 0 } }, () => {
            const baseUrl = Cypress.config('baseUrl')

            searchAndOpenReservationForm().then((roomId) => {
                
                cy.intercept('POST', '**/api/booking').as('createBooking')

                cy.fixture('data').then(({ validGuest }) => {
                    cy.get('form').within(() => {
                        cy.get('input[name="firstname"]').type(validGuest.firstname)
                        cy.get('input[name="lastname"]').type(validGuest.lastname)
                        cy.get('input[name="email"]').type(validGuest.email)
                        cy.get('input[name="phone"]').type(validGuest.phone)
                        cy.get('button').contains('Reserve Now').click()
                    })

                    // Wait for the real network response and check its status
                    // explicitly. This is what actually confirms the booking
                    // succeeded (201) — if a 409 slips through, this fails
                    // with a clear message instead of a vague "Booking
                    // Confirmed not found".
                    cy.wait('@createBooking').its('response.statusCode').should('eq', 201)

                    cy.contains('Booking Confirmed').should('be.visible')
                    // ----------------------------------------------------
                    // Backend check: confirm the reservation was actually saved
                    cy.loginAPI()

                    cy.request(`${baseUrl}/api/booking?roomid=${roomId}`).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body).to.have.property('bookings').that.is.an('array')
                        expect(response.body.bookings).to.not.be.empty

                        const matches = response.body.bookings.filter((booking) =>
                            booking.roomid === roomId &&
                            booking.firstname === validGuest.firstname &&
                            booking.lastname === validGuest.lastname &&
                            booking.bookingdates.checkin === checkInApi &&
                            booking.bookingdates.checkout === checkOutApi
                        )

                        // Exactly one match: rules out duplicates and confirms
                        // we're checking the right booking
                        expect(matches, 'Expected exactly one matching booking').to.have.length(1)
                        expect(matches[0]).to.have.property('depositpaid')
                    })
                })
            })
        })
    })

    context('Negative Tests', () => {
        it('Should not allow a reservation with invalid guest information', () => {
            // Intentionally NOT filtering uncaught:exception here. If the app
            // crashes (same TypeError seen with 409 conflicts — see the
            // conflict investigation), we want the test to fail with that
            // specific error, not a generic assertion failure.
            searchAndOpenReservationForm()

            cy.intercept('POST', '**/api/booking').as('createBooking')

            cy.fixture('data').then(({ invalidGuest }) => {
                cy.get('form').within(() => {
                    cy.get('input[name="firstname"]').type(invalidGuest.firstname)
                    cy.get('input[name="lastname"]').type(invalidGuest.lastname)
                    cy.get('input[name="email"]').type(invalidGuest.email)
                    cy.get('input[name="phone"]').type(invalidGuest.phone)
                    cy.get('button').contains('Reserve Now').click()
                })
            })

            // Logs the actual status code for this submission. Useful
            // evidence: if this matches the 409 seen with booking conflicts,
            // it supports the theory that both crashes share the same root
            // cause (the frontend doesn't handle any non-201 response).
            cy.wait('@createBooking').then(({ response }) => {
                cy.log(`Status for invalid guest data submission: ${response.statusCode}`)
            })

            // Covers all 3 possible outcomes: if the booking got confirmed by
            // mistake, the form is gone. If the app crashed, the uncaught
            // exception above would have already failed the test. The form
            // only stays visible in the correct outcome.
            cy.get('.card-body form').should('be.visible')
            cy.contains('Booking Confirmed').should('not.exist')
        })

        it('Should display validation messages when submitting an empty reservation form', () => {
            searchAndOpenReservationForm()

            cy.get('form button').contains('Reserve Now').click()

            cy.get('.alert-danger li').as('validationMessages')
            cy.get('@validationMessages').should('be.visible')

            // TODO: verify this count after removing .only and running the
            // suite for real — only 6 message contents are checked below,
            // but 7 are expected. Identify the missing one (likely
            // email-related) and add its assertion, or correct this number.
            cy.get('@validationMessages').should('have.length', 7)

            cy.get('@validationMessages').should('contain', 'must not be empty')
            cy.get('@validationMessages').should('contain', 'size must be between 3 and 30')
            cy.get('@validationMessages').should('contain', 'Firstname should not be blank')
            cy.get('@validationMessages').should('contain', 'size must be between 11 and 21')
            cy.get('@validationMessages').should('contain', 'Lastname should not be blank')
            cy.get('@validationMessages').should('contain', 'size must be between 3 and 18')
        })
    })


    // Returns a booking window that does not overlap with existing reservations.
    const findAvailableDateRange = (roomId) => {

        const baseUrl = Cypress.config('baseUrl')

        return cy.request(`${baseUrl}/api/booking?roomid=${roomId}`).then(({ body }) => {

            const bookings = body.bookings || []

            let bookingCheckIn
            let bookingCheckOut
            let searchCheckIn
            let searchCheckOut

            let overlap = true

            while (overlap) {

                const offset = randomInt(61, 180)
                const nights = randomInt(2, 5)

                const checkIn = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() + offset
                )

                const checkOut = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() + offset + nights
                )

                const checkInApi = formatApiDate(formatUiDate(checkIn))
                const checkOutApi = formatApiDate(formatUiDate(checkOut))

                overlap = bookings.some((booking) => {

                    const existingStart = booking.bookingdates.checkin
                    const existingEnd = booking.bookingdates.checkout

                    return (
                        checkInApi < existingEnd &&
                        checkOutApi > existingStart
                    )
                })

                if (!overlap) {

                    bookingCheckIn = checkInApi
                    bookingCheckOut = checkOutApi

                    searchCheckIn = formatUiDate(
                        new Date(
                            checkIn.getFullYear(),
                            checkIn.getMonth(),
                            checkIn.getDate() - 1
                        )
                    )

                    searchCheckOut = formatUiDate(checkOut)
                }
            }

            return {
                bookingCheckIn,
                bookingCheckOut,
                searchCheckIn,
                searchCheckOut
            }
        })
    }

    context('Availability Consistency', () => {
        it('SMB-72: Should not list a room as available if it has an overlapping booking', () => {
            const baseUrl = Cypress.config('baseUrl')
            const roomId = 1

            // Step 1: create a real booking directly via the API — faster
            // and more deterministic than going through the UI twice.

            cy.loginAPI()

            findAvailableDateRange(roomId).then((dates) => {

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

                cy.get('#booking').within(() => {
                    cy.get('input.form-control').as('dateInputs')

                    cy.get('@dateInputs').first().clear().type(`${dates.searchCheckIn}{enter}`)

                    cy.get('@dateInputs').eq(1).clear().type(`${dates.searchCheckOut}{enter}`)

                    cy.contains('button', 'Check Availability').click()
                })

                // The room should not be displayed because an overlapping
                // reservation already exists.
                // This assertion reproduces SMB-72 and is expected to fail
                // until the availability calculation is fixed.

                cy.get('#rooms .row > div a.btn-primary').should(($links) => {

                    const roomLinks = [...$links].map(link =>
                        link.getAttribute('href')
                    )

                    const roomIsListed = roomLinks.some(href =>
                        href.startsWith(`/reservation/${roomId}?`)
                    )

                    expect(roomIsListed, `Room ${roomId} should not be listed as available for overlapping dates`
                    ).to.be.false

                })
            })
        })
    })

    context('Error Handling', () => {
        it('SMB-73: Should handle a booking conflict (409) without crashing the application', () => {
            searchAndOpenReservationForm()

            // Simulates the real backend behavior documented in the conflict
            // investigation: POST /api/booking can return 409 when the room
            // becomes unavailable between the availability check and the
            // actual booking request. Stubbed here to reproduce it on
            // demand, instead of waiting for the real race condition.
            cy.intercept('POST', '**/api/booking', {
                statusCode: 409,
                body: { error: 'Failed to create booking' }
            }).as('createBooking')

            cy.fixture('data').then(({ validGuest }) => {
                cy.get('form').within(() => {
                    cy.get('input[name="firstname"]').type(validGuest.firstname)
                    cy.get('input[name="lastname"]').type(validGuest.lastname)
                    cy.get('input[name="email"]').type(validGuest.email)
                    cy.get('input[name="phone"]').type(validGuest.phone)
                    cy.get('button').contains('Reserve Now').click()
                })
            })

            cy.wait('@createBooking')

            // Known bug: currently crashes with an uncaught TypeError
            // instead of showing a clear conflict message. This assertion
            // is expected to fail until that's fixed on the app side.
            cy.get('.card-body form').should('be.visible')
        })
    })
})