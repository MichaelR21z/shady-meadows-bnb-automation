describe('Known Defects - Homepage Rooms', () => {
    // Known defect: SMB-134 - The room catalog does not display an empty-state message.
    it('TC49 - Verificar comportamiento cuando el catálogo de habitaciones está vacío [SMB-134]', () => {
        cy.intercept('GET', '/api/room', {
            statusCode: 200,
            body: {
                rooms: []
            }
        }).as('getEmptyRooms')

        cy.visit('/')

        cy.wait('@getEmptyRooms')
            .its('response.statusCode')
            .should('eq', 200)

        cy.get('#rooms .room-card').should('not.exist')

        const emptyRoomMessages = [
            'No rooms available',
            'No rooms found',
            'There are no rooms available'
        ]

        cy.get('#rooms').invoke('text').then((text) => {
            const hasEmptyRoomMessage = emptyRoomMessages.some((message) => {
                return text.includes(message)
            })

            expect(hasEmptyRoomMessage).to.be.true
        })
    })
})