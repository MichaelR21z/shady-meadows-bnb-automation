describe('Room Reservation', () => {
    // Mapeo de tipo de habitación -> roomid. Fijo porque el sitio solo tiene
    // estas 3 habitaciones — si el catálogo cambia, este mapeo se rompe.
    const ROOM_TYPE_TO_ID = {
        'Single Room': 1,
        'Double Room': 2,
        'Suite Room': 3
    }

    // Function to format the date in dd/mm/yyyy format
    const formatUiDate = (date) => {
        // Se utiliza String() para convertir el dia en una cadena y padStart() para asegurarse de que tenga al menos 2 caracteres, agregando un cero a la izquierda si es necesario
        const dd = String(date.getDate()).padStart(2, '0')
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }
    // Formato de la fecha del API
    const formatApiDate = (uiDate) => {
        const [day, month, year] = uiDate.split('/')
        return `${year}-${month}-${day}`
    }

    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    // An object is created with the current date and time
    const today = new Date() 

    // Random dates in each execution
    const checkInOffset = randomInt(1, 60)
    const nights = randomInt(1, 10)

    const checkInDate = formatUiDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + checkInOffset))
    const checkOutDate = formatUiDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + checkInOffset + nights))

    const checkInApi = formatApiDate(checkInDate)
    const checkOutApi = formatApiDate(checkOutDate)


    const searchAndOpenReservationForm = () => {
        //Select Booking Dates
        cy.get('#booking').within(() => {
            cy.get('h3').should('have.text', 'Check Availability & Book Your Stay')
            cy.get('input[class="form-control"]').as('dateInputs')

            // Enter and verify the check-in date
            cy.get('@dateInputs').first().clear().type(`${checkInDate}{enter}`)
            cy.get('@dateInputs').first().should('have.value', checkInDate)

            // Enter and verify the check-out date
            cy.get('@dateInputs').eq(1).clear().type(`${checkOutDate}{enter}`)
            cy.get('@dateInputs').eq(1).should('have.value', checkOutDate)

            // Click the "Check Availability" button to filter rooms based on the selected dates
            cy.get('button').should('have.text', 'Check Availability').click()

        })
        // Ensure that at least one room is available.
        cy.get('#rooms .row > div').should('have.length.greaterThan', 0)

        return cy.get('#rooms .row > div').eq(0).find('img').invoke('attr', 'alt').then((altText) => {
            const roomId = ROOM_TYPE_TO_ID[altText]

            // Validate that the selected room type has a mapped room ID
            expect(roomId, `tipo de habitación no reconocido: "${altText}"`).to.exist

            // Navigate to the room and open the form
            cy.get('#rooms .row > div').eq(0).find('a').click()
            cy.get('#doReservation').click()

            // Return the room ID to validate the reservation in the backend.
            return cy.wrap(roomId)
        })
    }

    beforeEach(() => {
        cy.visit('/')

        // Ignore the known React issue to avoid unrelated test failures
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('Minified React error #418')) {  
                return false 
            }
            return true
        })
    })

    context('Happy Path', () => {
        it('Should create a room reservation and verify it in the backend', () => {
            const baseUrl = Cypress.config('baseUrl')

            // Open the reservation form and keep the selected room ID for the backend verification.
            searchAndOpenReservationForm().then((roomId) => {    // We check if the reservation was saved in the backend
                // Load valid guest data from the fixture
                cy.fixture("data").then(({ validGuest }) => {

                    // Complete the form with valid guest data
                    cy.get('form').within(() => {
                        cy.get('input[name="firstname"]').type(validGuest.firstname)
                        cy.get('input[name="lastname"]').type(validGuest.lastname)
                        cy.get('input[name="email"]').type(validGuest.email)
                        cy.get('input[name="phone"]').type(validGuest.phone)

                        cy.get('button').contains('Reserve Now').click()
                    })
                    // Verify that the booking confirmation message is displayed
                    cy.contains('Booking Confirmed').should('be.visible')
                    cy.contains('Your booking has been confirmed for the following dates:').should('be.visible')

                    // ----------------------------------------------------
                    // Authenticate through the API using credentials stored in environment variables
                    loginAPI()

                    // Load the guest data to compare it with the backend response
                    cy.fixture('data').then(({ validGuest }) => {

                        //Validate the booking endpoint and verify that the newly created reservation was stored correctly
                        cy.request(`${baseUrl}/api/booking?roomid=${roomId}`).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body).to.have.property('bookings').that.is.an('array')
                            expect(response.body.bookings).to.not.be.empty

                            // Locate the reservation created during this test execution
                            const matchingBooking = response.body.bookings.find((booking) => {
                                return (
                                    booking.bookingdates.checkin === checkInApi &&
                                    booking.bookingdates.checkout === checkOutApi &&
                                    booking.firstname === validGuest.firstname &&
                                    booking.lastname === validGuest.lastname &&
                                    booking.roomid === roomId
                                )
                            })
                            // Verify that the reservation exists
                            expect(matchingBooking).to.exist
                        })
                    })
                })
            })
        })
    })

    context('Negative Tests', () => {
        it('Should not allow a reservation with invalid guest information', () => {

            // Open the reservation form for an available room
            searchAndOpenReservationForm()

            // Monitor the booking request and wait for it to complete
            // before validating the UI
            cy.intercept('POST', '**/api/booking').as('createBooking')

            // Submit the reservation using invalid guest data
            cy.fixture("data").then(({ invalidGuest }) => {

                cy.get('form').within(() => {
                    cy.get('input[name="firstname"]').type(invalidGuest.firstname)
                    cy.get('input[name="lastname"]').type(invalidGuest.lastname)
                    cy.get('input[name="email"]').type(invalidGuest.email)
                    cy.get('input[name="phone"]').type(invalidGuest.phone)

                    cy.get('button').contains('Reserve Now').click()
                })
            })

            // Wait until the booking request finishes before checking the UI.
            cy.wait('@createBooking')

            // Verify that the reservation is rejected and the booking form remains visible
            cy.get('.card-body form').should('be.visible')
            cy.contains('Booking Confirmed').should('not.exist')
        })

        it('Should display validation messages when submitting an empty reservation form', () => {
            // Open the reservation form for an available room
            searchAndOpenReservationForm()

            // Submit the reservation form without entering guest information.
            cy.get('form button').contains('Reserve Now').click()

            // Verify that all expected validation messages are displayed.
            cy.get('.alert-danger li').as('validationMessages')

            cy.get('@validationMessages').should('be.visible')
            cy.get('@validationMessages').should('have.length', 7)

            cy.get('@validationMessages').should('contain', 'must not be empty')
            cy.get('@validationMessages').should('contain', 'size must be between 3 and 30')
            cy.get('@validationMessages').should('contain', 'Firstname should not be blank')
            cy.get('@validationMessages').should('contain', 'size must be between 11 and 21')
            cy.get('@validationMessages').should('contain', 'Lastname should not be blank')
            cy.get('@validationMessages').should('contain', 'size must be between 3 and 18')
        })
    })
})