// Format a JavaScript Date object into the format used by the UI (dd/mm/yyyy)
export const formatUiDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${dd}/${mm}/${yyyy}`
}

// Convert a UI date (dd/mm/yyyy) into the format expected by the
// Booking API (yyyy-mm-dd).
export const formatApiDate = (uiDate) => {
    const [day, month, year] = uiDate.split('/')
    return `${year}-${month}-${day}`
}

// Generate a random integer within the provided range.
// Used to create different booking dates on each execution
// and reduce conflicts with existing reservations.
export const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min


// Generate a fresh set of booking dates every time this function
// is called. Keeping the date generation inside a function ensures
// that each test receives a new random date range instead of
// reusing the same dates calculated when the module was imported.

export const createRandomBookingDates = () => {

    // Use the current date as the reference point for generating
    // future reservation dates.
    const today = new Date()

    // Randomly choose how many days in the future the reservation
    // will start and how many nights it will last.
    const checkInOffset = randomInt(1, 60)
    const nights = randomInt(1, 10)

    // Calculate dynamic check-in and check-out dates. JavaScript
    // automatically adjusts the month and year if the resulting
    // day exceeds the number of days in the current month.
    const checkInDate = formatUiDate(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + checkInOffset
        )
    )

    const checkOutDate = formatUiDate(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + checkInOffset + nights
        )
    )

    // Convert the UI dates into the format expected by the
    // Booking API so they can be compared directly with the
    // backend response.
    const checkInApi = formatApiDate(checkInDate)
    const checkOutApi = formatApiDate(checkOutDate)

    // Return every generated value so tests can reuse the same
    // dates for both the UI and API validations without having
    // to recalculate them.
    return {
        checkInDate,
        checkOutDate,
        checkInApi,
        checkOutApi
    }
}