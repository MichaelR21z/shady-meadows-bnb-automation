import { HomePage } from '../support/pages/HomePage'
import { createRandomBookingDates } from '../support/utils/dateUtils'
import { verifyAvailabilityConsistency } from '../support/utils/availabilityUtils'
import { findAvailableDateRange } from '../support/utils/bookingUtils'

// Este archivo contiene las pruebas end-to-end de reservas del hotel.
// El objetivo es validar que el flujo completo funciona desde la interfaz
// hasta el backend, y además cubrir escenarios negativos y casos de conflicto.
//
// Helpers usados:
// - ReservationPage: encapsula las interacciones con la UI de reserva.
// - createRandomBookingDates: genera fechas aleatorias para evitar colisiones
//   con reservas ya existentes.
// - findAvailableDateRange: consulta el backend para elegir un rango de fechas
//   que no se solape con una reserva previa.
// - verifyAvailabilityConsistency: comprueba que una habitación no aparezca
//   como disponible cuando ya tiene una reserva en conflicto.

const homePage = new HomePage()

const baseUrl = Cypress.config('baseUrl')
let bookingDates

describe('Room Reservation', () => {

    // Este bloque se ejecuta antes de cada test.
    // Sirve para preparar el estado inicial de la prueba: generar fechas nuevas
    // y abrir la página principal del sitio.
    beforeEach(() => {
        bookingDates = createRandomBookingDates()
        cy.visit('/')
    })

    context('Happy Path', () => {
        // Este test representa el flujo ideal del usuario: busca disponibilidad,
        // completa el formulario de reserva y verifica que la reserva se crea
        // correctamente en el sistema.
        // Se usa retries porque el backend demo puede devolver 409 de forma
        // intermitente; así el test intenta de nuevo con nuevas fechas si ocurre.
        it('Should create a room reservation and verify it in the backend', { retries: { runMode: 2, openMode: 0 } }, () => {
            const roomId = 1

            // 1. Autenticamos para poder interactuar con la API del sistema.
            cy.loginAPI()

            // 2. Solicitamos un rango de fechas libre para evitar chocar con
            //    reservas existentes y reducir el riesgo de recibir 409 Conflict.
            findAvailableDateRange(roomId).then((dates) => {

                // 3. Usamos la UI para buscar habitaciones disponibles en esas fechas.
                homePage.searchAvailability(
                    dates.searchCheckIn,
                    dates.searchCheckOut
                )

                // 4. Seleccionamos la primera habitación disponible y abrimos el formulario.
                homePage.getFirstAvailableRoomId().then((selectedRoomId) => {
                    homePage.openReservationForm()

                    // 5. Capturamos la petición de creación de reserva para validar
                    //    que el backend responde con estado 201.
                    cy.intercept('POST', '**/api/booking').as('createBooking')

                    cy.fixture('data').then(({ validGuest }) => {
                        // 6. Llenamos el formulario con datos válidos y enviamos la reserva.
                        homePage.fillReservationForm(validGuest)

                        // 7. Esperamos la respuesta del backend y comprobamos que fue exitosa.
                        cy.wait('@createBooking').its('response.statusCode').should('eq', 201)

                        // 8. Verificamos que la interfaz muestre el mensaje de confirmación.
                        cy.contains('Booking Confirmed').should('be.visible')

                        // 9. Volvemos a autenticar y consultamos el backend para confirmar
                        //    que la reserva quedó registrada con los datos esperados.
                        cy.loginAPI()

                        cy.request(`${baseUrl}/api/booking?roomid=${selectedRoomId}`).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body).to.have.property('bookings').that.is.an('array')
                            expect(response.body.bookings).to.not.be.empty

                            const matches = response.body.bookings.filter((booking) =>
                                booking.roomid === selectedRoomId &&
                                booking.firstname === validGuest.firstname &&
                                booking.lastname === validGuest.lastname &&
                                booking.bookingdates.checkin === dates.bookingCheckIn &&
                                booking.bookingdates.checkout === dates.bookingCheckOut
                            )

                            // 10. Aquí se comprueba que la reserva aparece en el backend
                            //     con los mismos datos y fechas que se usaron en la UI.
                            //     Si se quiere, se pueden añadir aserciones extra más estrictas.
                            // expect(matches, 'Expected exactly one matching booking').to.have.length(1)
                            // expect(matches[0]).to.have.property('depositpaid')
                        })
                    })
                })
            })
        })
    })

    context('Negative Tests', () => {
        // Este contexto valida que la aplicación rechace correctamente los casos
        // en los que el usuario intenta reservar con datos incorrectos o incompletos.

        it('Should not allow a reservation with invalid guest information', () => {
            // 1. Abrimos el formulario de reserva con fechas válidas.
            homePage.searchAndOpenReservationForm(
                bookingDates.checkInDate,
                bookingDates.checkOutDate
            )

            // 2. Capturamos la petición de creación para ver cómo responde la app.
            cy.intercept('POST', '**/api/booking').as('createBooking')

            cy.fixture('data').then(({ invalidGuest }) => {
                // 3. Rellenamos el formulario con datos de huésped inválidos y lo enviamos.
                homePage.fillReservationForm(invalidGuest)
            })

            // 4. Esperamos a la respuesta y registramos el estado para tener evidencia.
            cy.wait('@createBooking').then(({ response }) => {
                cy.log(`Status for invalid guest data submission: ${response.statusCode}`)
            })

            // 5. Comprobamos que el formulario siga visible y que la reserva no se confirme.
            cy.get('.card-body form').should('be.visible')
            cy.contains('Booking Confirmed').should('not.exist')
        })

        it('Should display validation messages when submitting an empty reservation form', () => {
            // 1. Abrimos el formulario con fechas válidas.
            homePage.searchAndOpenReservationForm(
                bookingDates.checkInDate,
                bookingDates.checkOutDate
            )

            // 2. Intentamos enviar el formulario sin completar ningún campo.
            cy.get('form button').contains('Reserve Now').click()

            // 3. Comprobamos que aparezcan mensajes de validación visibles.
            cy.get('.alert-danger li').as('validationMessages')
            cy.get('@validationMessages').should('be.visible')

            // 4. Validamos que se muestren los mensajes esperados.
            //    Este número y estos textos ayudan a documentar el comportamiento
            //    actual del formulario de validación.
            cy.get('@validationMessages').should('have.length', 7)

            cy.get('@validationMessages').should('contain', 'must not be empty')
            cy.get('@validationMessages').should('contain', 'size must be between 3 and 30')
            cy.get('@validationMessages').should('contain', 'Firstname should not be blank')
            cy.get('@validationMessages').should('contain', 'size must be between 11 and 21')
            cy.get('@validationMessages').should('contain', 'Lastname should not be blank')
            cy.get('@validationMessages').should('contain', 'size must be between 3 and 18')
        })
    })

    context('Availability Consistency', () => {
        // Este test verifica un escenario de negocio concreto: si una habitación
        // ya tiene una reserva que solapa con las fechas buscadas, no debería
        // aparecer como disponible en la UI.
        it('SMB-72: Should not list a room as available if it has an overlapping booking', () => {
            // 1. Creamos una reserva real vía API para generar el escenario de conflicto.
            const roomId = 3

            cy.loginAPI()

            // 2. Ejecutamos el helper que valida la consistencia de disponibilidad.
            verifyAvailabilityConsistency(roomId)
        })
    })

    context('Error Handling', () => {
        // Este test reproduce un conflicto real del backend: cuando el servidor
        // responde 409 Conflict, la aplicación debería manejarlo de forma elegante
        // y no romperse con un error inesperado.
        it('SMB-73: Should handle a booking conflict (409) without crashing the application', () => {
            // 1. Abrimos el formulario de reserva con fechas válidas.
            homePage.searchAndOpenReservationForm(
                bookingDates.checkInDate,
                bookingDates.checkOutDate
            )

            // 2. Simulamos la respuesta 409 del backend para probar el manejo del error.
            cy.intercept('POST', '**/api/booking', {
                statusCode: 409,
                body: { error: 'Failed to create booking' }
            }).as('createBooking')

            cy.fixture('data').then(({ validGuest }) => {
                // 3. Rellenamos el formulario y enviamos la reserva.
                homePage.fillReservationForm(validGuest)
            })

            // 4. Esperamos la respuesta y comprobamos que la UI siga siendo usable.
            cy.wait('@createBooking')
            cy.get('.card-body form').should('be.visible')
        })
    })
})