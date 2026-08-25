describe('Homepage Rooms', () => {

    it('TC47 - Verificar visualización del catálogo de habitaciones en la homepage', () => {

        cy.intercept('GET', '/api/room').as('getRooms')

        cy.visit('/')

        cy.wait('@getRooms').then(({ response }) => {

            expect(response.statusCode).to.eq(200)

            const rooms = response.body.rooms

            expect(rooms).to.be.an('array')
            expect(rooms.length).to.be.greaterThan(0)

            cy.get('#rooms').should('be.visible')

            cy.get('#rooms .row > div').should('have.length', rooms.length)
        })

        cy.get('#rooms .row > div').find('a.btn-primary').then(($buttons) => {

            const roomIds = [...$buttons].map((button) => {

                const href = button.getAttribute('href')
                return href.match(/\/reservation\/(\d+)/)[1]
            })

            expect(new Set(roomIds).size).to.eq(roomIds.length)

        })
    })

    it('TC48 - Verificar correspondencia entre la información de las habitaciones en la UI y GET /api/room', () => {

        cy.intercept('GET', 'api/room').as('getRooms')

        cy.visit('/')

        cy.wait('@getRooms').then(({ response }) => {

            expect(response.statusCode).to.eq(200)

            const rooms = response.body.rooms

            expect(rooms).to.be.an('array')
            expect(rooms.length).to.be.greaterThan(0)

            rooms.forEach((room) => {

                cy.get(`#rooms .room-card a[href^="/reservation/${room.roomid}?"]`)
                    .closest('.room-card').within(() => {

                        cy.get('.card-title').should('have.text', room.type)

                        cy.get('.card-img-top').should('have.attr', 'src', room.image)

                        cy.get('.card-body > .card-text').first().should('have.text', room.description)

                        cy.get('.badge').should('have.length', room.features.length)

                        room.features.forEach((features) => {
                            cy.get('.badge').contains(features).should('be.visible')
                        })

                        cy.get('.card-footer > .fw-bold').should('have.text', `£${room.roomPrice} per night`)

                    })
            })
        })
    })

    // Related defect: SMB-134 - No informational message is displayed when the room catalog is empty.
    it('TC49 - Verificar comportamiento cuando el catálogo de habitaciones está vacío [SMB-SMB-134]', () => {

        cy.intercept('GET', '/api/room', {
            statusCode: 200,
            body: {
                rooms: []
            }
        }).as('getEmptyRooms')

        cy.visit('/')

        cy.wait('@getEmptyRooms').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
            expect(response.body.rooms).to.be.an('array').and.be.empty
        })

        cy.get('body').should('be.visible')

        const sections = ['.hero', '#booking', '#rooms', '#location', '#contact']

        sections.forEach((section) => {

            cy.get(section).should('be.visible')

        })

        cy.get('#rooms .room-card').should('not.exist')

        // Possible empty-state messages used for this test scenario.
        const emptyRoomMessages = ['No rooms available', 'No rooms found', 'There are no rooms available',]

        cy.get('#rooms').invoke('text').then((text) => {

            const hasEmptyRoomMessage = emptyRoomMessages.some((message) => text.includes(message))

            expect(hasEmptyRoomMessage).to.be.true
        })
    })

    it('TC50 - Verificar comportamiento ante información incompleta de una habitación', () => {

        cy.loginAPI().then((token) => {

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

                cy.request({
                    method: 'PUT',
                    url: `/api/room/${selectedRoom.roomid}`,
                    headers: {
                        Cookie: `token=${token}`
                    },
                    body: incompleteRoom
                }).then((updateResponse) => {

                    expect(updateResponse.status).to.eq(202)
                })

                cy.intercept('GET', '/api/room').as('getRooms')

                cy.visit('/')

                cy.wait('@getRooms').then(({ response }) => {

                    expect(response.statusCode).to.eq(200)

                    const modifiedRoom = response.body.rooms.find((currentRoom) => currentRoom.roomid === selectedRoom.roomid)

                    expect(modifiedRoom).to.exist

                    expect(modifiedRoom.description).to.eq('')
                    expect(modifiedRoom.features).to.be.an('array').and.be.empty
                    expect(modifiedRoom.image).to.eq('')

                    cy.get(`#rooms .room-card a[href^="/reservation/${selectedRoom.roomid}?"]`).closest('.room-card').within(() => {

                        cy.get('.card-title').should('have.text', selectedRoom.type)

                        cy.get('.card-footer > .fw-bold').first().should('have.text', `£${selectedRoom.roomPrice} per night`)

                        cy.get('.card-body > .card-text').first().should('have.text', incompleteRoom.description)

                        cy.get('.badge').should('not.exist')

                        cy.get('.card-img-top').should('not.have.attr', 'src')

                    })
                })
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
