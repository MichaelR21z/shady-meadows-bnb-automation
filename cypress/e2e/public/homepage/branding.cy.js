import { HomePage } from '../../../support/pages/HomePage'

const homePage = new HomePage()

describe('Homepage Branding', () => {

    // Verify that the homepage displays the hotel's public branding, contact information, and location details.
    it('TC37 - Verificar información del hotel mostrada en la homepage', () => {
        cy.visit('/')

        homePage.verifyHotelName()
        homePage.verifyHeroImage()
        homePage.verifyHotelDescription()
        homePage.verifyLocationContactInformation()
        homePage.verifyLocationMap()
        homePage.verifyFooterContactInformation()
    })

    it('TC38 - Verificar consistencia entre /api/branding y la información mostrada en la UI', () => {
        cy.request('GET', '/api/branding').then((response) => {
            expect(response.status).to.eq(200)

            const branding = response.body
            //  cy.log(branding.contact.email)

            cy.visit('/')

            homePage.verifyBrandingAgainstApi(branding)
        })
    })

    // Related defect: SMB-110 - missing branding object.
    // The homepage crashes when a main /api/branding object is missing.
    it('TC41 - Validar comportamiento de la homepage cuando falta un objeto de /api/branding [SMB-110]', () => {
        
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
                
                // map object intentionally omitted to simulate incomplete branding data.
                // map: {
                //     latitude: 52.6351204,
                //     longitude: 1.2733774
                // },
                name: 'Shady Meadows B&B'
            }
        }).as('brandingWithoutMap')

        cy.visit('/')

        cy.wait('@brandingWithoutMap').its('response.statusCode').should('eq', 200)

        // Verify that the homepage remains available despite the missing map object.
        cy.get('body').should('be.visible')

        cy.get('#booking').should('be.visible')
    })
})
