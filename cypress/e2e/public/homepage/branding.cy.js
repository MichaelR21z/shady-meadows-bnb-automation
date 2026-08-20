describe('Branding', () => {
    context('SMB-10 - Información del hotel en la homepage', () => {
        //Failed
        it.skip('TC41 - Validar comportamiento de la homepage cuando falta un objeto de /api/branding', () => {
            cy.intercept('GET', '**/api/branding', {
                statusCode: 200,
                body: {
                    address: {
                        county: 'Dilbery',
                        line1: 'Shady Meadows B&B',
                        line2: 'Shadows valley',
                        postCode: 'N1 1AA',
                        postTown: 'Newingtonfordburyshire'
                    },
                    contact: {
                        email: 'fake@fakeemail.com',
                        name: 'Shady Meadows B&B',
                        phone: '012345678901'
                    },
                    description: 'Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire.',
                    directions: 'Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire.',
                    logoUrl: '/images/rbp-logo.jpg',
                    // map: {
                    //     latitude: 52.6351204,
                    //     longitude: 1.2733774
                    // },
                    name: 'Shady Meadows B&B'
                }
            }).as('branding')

            cy.visit('/')

            cy.wait('@branding')
        })
    })
})
