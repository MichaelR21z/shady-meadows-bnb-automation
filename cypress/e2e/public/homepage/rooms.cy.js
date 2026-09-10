describe('Homepage Rooms', () => {

    // Since this is a shared practice environment, room data may be modified by other users,
    // which can temporarily cause differences between the API response and the rendered room catalog.
    it('TC47 - Verificar visualización del catálogo de habitaciones en la homepage', () => {

        // Capture the room response used to render the homepage catalog.
        cy.intercept('GET', '/api/room').as('getRooms')

        cy.visit('/')

        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200)

            const rooms = response.body.rooms

            // Verify that the API returns at least one room.
            expect(rooms).to.be.an('array')
            expect(rooms.length).to.be.greaterThan(0)

            cy.get('#rooms').should('be.visible')

            cy.get('#rooms .row > div').should('have.length.greaterThan', 0)
        })

        // Verify that every visible room has a unique reservation link.
        cy.get('#rooms .row > div').find('a.btn-primary').then(($buttons) => {

            const roomIds = [...$buttons].map((button) => {

                const href = button.getAttribute('href')
                return href.match(/\/reservation\/(\d+)/)[1]
            })

            expect(new Set(roomIds).size).to.eq(roomIds.length)

        })
    })

    it('TC48 - Verificar correspondencia entre habitaciones visibles en UI y GET /api/room', () => {
        
        cy.intercept('GET', '**/api/room').as('getRooms')

        cy.visit('/')

        cy.wait('@getRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200)

            const rooms = response.body.rooms

            expect(rooms).to.be.an('array')
            expect(rooms.length).to.be.greaterThan(0)

            // Extract the IDs of the rooms currently rendered in the UI.
            cy.get('#rooms .room-card a.btn-primary').then(($buttons) => {
                const visibleRoomIds = [...$buttons].map((button) => {
                    const href = button.getAttribute('href')

                    return Number(
                        href.match(/\/reservation\/(\d+)/)[1]
                    )
                })

                expect(visibleRoomIds.length).to.be.greaterThan(0)
                
                // Compare every visible room with its corresponding API object.
                visibleRoomIds.forEach((roomId) => {
                    const room = rooms.find(
                        (currentRoom) => currentRoom.roomid === roomId
                    )

                    expect(
                        room,
                        `Room ${roomId} displayed in the UI should exist in the API`
                    ).to.exist
         
                    // Verify the information displayed on the room card.
                    cy.get(`#rooms .room-card a[href^="/reservation/${room.roomid}?"]`)
                        .closest('.room-card').within(() => {
                            cy.get('.card-title')
                                .should('have.text', room.type)

                            cy.get('.card-img-top')
                                .should('have.attr', 'src', room.image)

                            cy.get('.card-body > .card-text')
                                .first()
                                .should('have.text', room.description)

                            cy.get('.badge')
                                .should('have.length', room.features.length)

                            room.features.forEach((feature) => {
                                cy.contains('.badge', feature)
                                    .should('be.visible')
                            })

                            cy.get('.card-footer > .fw-bold')
                                .should(
                                    'have.text',
                                    `£${room.roomPrice} per night`
                                )
                        })
                })
            })
        })
    })

    it('TC50 - Verificar comportamiento ante información incompleta de una habitación', () => {

        cy.request('GET', '/api/room').then((response) => {
            const rooms = response.body.rooms

            expect(rooms).to.be.an('array')
            expect(rooms.length).to.be.greaterThan(0)

            const selectedRoom = rooms[0]

            const incompleteRoom = {
                ...selectedRoom,
                description: '',
                features: [],
                image: ''
            }

            // Return incomplete room data without modifying the shared environment.
            const incompleteRooms = rooms.map((room) => {
                return room.roomid === selectedRoom.roomid
                    ? incompleteRoom
                    : room
            })

            cy.intercept('GET', '**/api/room', {
                statusCode: 200,
                body: {
                    rooms: incompleteRooms
                }
            }).as('getIncompleteRooms')

            cy.visit('/')

            cy.wait('@getIncompleteRooms')
                .its('response.statusCode')
                .should('eq', 200)

            cy.get(
                `#rooms .room-card a[href^="/reservation/${selectedRoom.roomid}?"]`
            )
                .closest('.room-card')
                .within(() => {
                    cy.get('.card-title')
                        .should('have.text', selectedRoom.type)

                    cy.get('.card-footer > .fw-bold')
                        .first()
                        .should('have.text', `£${selectedRoom.roomPrice} per night`)

                    cy.get('.card-body > .card-text')
                        .first()
                        .should('have.text', '')

                    cy.get('.badge').should('not.exist')

                    cy.get('.card-img-top')
                        .should('not.have.attr', 'src')
                })
        })
    })

    it('TC51 - Verificar acceso al flujo de reserva desde una habitación', () => {

        cy.visit('/')

        cy.get('#booking .form-control').as('dateInputs')

        cy.get('@dateInputs').first().invoke('val').then((checkInDate) => {

            cy.get('@dateInputs').eq(1).invoke('val').then((checkOutDate) => {

                const formatDateForUrl = (date) => {
                    const [day, month, year] = date.split('/')
                    return `${year}-${month}-${day}`
                }

                const checkInUrl = formatDateForUrl(checkInDate)
                const checkOutUrl = formatDateForUrl(checkOutDate)

                cy.get('#rooms .room-card a.btn-primary').then(($buttons) => {

                    const reservationLinks = [...$buttons].map((button) => button.getAttribute('href'))

                    reservationLinks.forEach((href) => {

                        const roomId = href.match(/\/reservation\/(\d+)/)[1]

                        // Pause briefly to facilitate the observation of navigation during execution.
                        // cy.wait(500)

                        cy.visit('/')

                        cy.get(`#rooms .room-card a[href^="/reservation/${roomId}?"]`).should('be.visible').click()

                        cy.location('pathname').should('eq', `/reservation/${roomId}`)

                        cy.location('search').should('include', `checkin=${checkInUrl}`).and('include', `checkout=${checkOutUrl}`)

                        cy.get('body').should('be.visible')
                    })
                })
            })
        })
    })

    it('TC52 - Verificar que las imágenes de las páginas públicas cargan correctamente', () => {

        cy.visit('/')

        cy.get('img[src^="/images/"]').each(($img) => {

            cy.wrap($img).should('have.attr', 'src').and('not.be.empty')

            cy.wrap($img).should('be.visible')

            cy.wrap($img).then(($element) => {

                expect($element[0].naturalWidth, `Image failed to load: ${$element.attr('src')}`).to.be.greaterThan(0)
            })
        })

        cy.get('[style*="background-image"]').each(($element) => {

            cy.wrap($element).should('have.css', 'background-image').and('not.eq', 'none')

            cy.wrap($element).invoke('css', 'background-image').then((backgroundImage) => {

                const imageUrl = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '')

                cy.request(imageUrl).its('status').should('eq', 200)

            })
        })
    })
})
