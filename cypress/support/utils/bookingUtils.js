import { formatApiDate, formatUiDate, randomInt } from './dateUtils'

// Returns a booking window that does not overlap with existing reservations.
export const findAvailableDateRange = (roomId) => {
    const today = new Date()
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