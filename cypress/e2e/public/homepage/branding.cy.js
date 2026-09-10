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

            cy.visit('/')

            homePage.verifyBrandingAgainstApi(branding)
        })
    })
})
