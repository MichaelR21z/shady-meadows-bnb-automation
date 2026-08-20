// Maps each room type displayed in the UI to its corresponding
// backend room ID. This allows the reservation created through
// the UI to be verified later using the Booking API.

export const ROOM_TYPE_TO_ID = {
    'Single Room': 1,
    'Double Room': 2,
    'Suite Room': 3
}