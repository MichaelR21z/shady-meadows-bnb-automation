describe('Public Image Resources', () => {

    // These tests validate public image resources used by the homepage.
    // Since this is a shared practice environment, room data may be modified by other users,
    // so dynamically created rooms can introduce external or broken image URLs.

    it('TC53 - Verificar las respuestas HTTP de los recursos de imagen públicos', () => {

        cy.visit('/')

        // Store all image URLs found in the UI and public APIs
        const imageUrls = []

        // Find application images rendered with <img> elements
        cy.get('img[src^="/images/"]').each(($img) => {

            const src = $img.attr('src')

            // Check that src has a valid value before adding it to the image URLs array   
            if (src) {
                imageUrls.push(src)
            }
        })

        // Find images rendered through the CSS background-image property
        cy.get('[style*="background-image"]').each(($element) => {

            cy.wrap($element).invoke('css', 'background-image').then((backgroundImage) => {

                // Remove url("...") from the CSS value to keep only the image URL
                const imageUrl = backgroundImage
                    .replace(/^url\(["']?/, '')
                    .replace(/["']?\)$/, '')

                // Ignore elements where CSS does not define a background image (`background-image: none`)
                if (imageUrl && imageUrl !== 'none') {
                    imageUrls.push(imageUrl)
                }
            })
        })

        // Collect image URLs from public API endpoints used to load homepage content
        cy.request('GET', '/api/room').then((response) => {

            expect(response.status).to.eq(200)

            const rooms = response.body.rooms

            expect(rooms).to.be.an('array')

            // Check that the room has an image value before adding its URL to the array
            rooms.forEach((rooms) => {
                if (rooms.image) {
                    imageUrls.push(rooms.image)
                }
            })
        })

        // Collect image URLs from the branding endpoint used by the homepage 
        cy.request('GET', '/api/branding').then((response) => {

            expect(response.status).to.eq(200)

            const branding = response.body

            expect(branding).to.be.an('object')

            // Check that logoUrl has a valid value before adding it to the image URLs array
            if (branding.logoUrl) {
                imageUrls.push(branding.logoUrl)
            }
        })

        // Verify every image resource hosted by the application.
        cy.then(() => {
            const applicationUrl = new URL(Cypress.config('baseUrl'))

            // Convert relative URLs to absolute URLs.
            const applicationImageUrls = imageUrls
                .map((imageUrl) => new URL(imageUrl, applicationUrl))

                // Exclude external images that are not controlled by the application.
                .filter((imageUrl) => {
                    return (
                        imageUrl.origin === applicationUrl.origin &&
                        imageUrl.pathname.startsWith('/images/')
                    )
                })

                // Keep only the final URL value.
                .map((imageUrl) => imageUrl.href)

            // Remove duplicated image URLs.
            const uniqueImageUrls = [...new Set(applicationImageUrls)]

            // Verify that at least one application image was found.
            expect(uniqueImageUrls.length).to.be.greaterThan(0)

            uniqueImageUrls.forEach((imageUrl) => {
                
                // Request each image without stopping automatically on an HTTP error.
                cy.request({
                    method: 'GET',
                    url: imageUrl,
                    failOnStatusCode: false
                }).then((response) => {
                    // Verify that the image resource is available.
                    expect(
                        response.status,
                        `Image request failed: ${imageUrl}`
                    ).to.eq(200)

                    // Verify that the response contains an image.
                    expect(
                        response.headers['content-type'],
                        `Invalid image content type: ${imageUrl}`
                    ).to.include('image/')
                })
            })
        })
    })

    it('TC54 - Verificar comportamiento de la aplicación cuando una imagen no puede cargarse', () => {

        const brokenLogoUrl = `/images/tc54-broken-logo-${Date.now()}.jpg`

        // Replace the branding logo URL with a controlled broken image URL for this test.
        cy.intercept('GET', '**/api/branding', (req) => {
            req.continue((res) => {
                res.body.logoUrl = brokenLogoUrl
            })
        }).as('getBranding')

        // Intercept the controlled logo request and simulate a 404 Not Found response.
        cy.intercept('GET', `**${brokenLogoUrl}`, {
            statusCode: 404,
            body: 'Not Found'
        }).as('image404')

        cy.visit('/')

        // Verify that the homepage requests the branding information.
        cy.wait('@getBranding')
            .its('response.statusCode')
            .should('eq', 200)

        // Verify that the controlled image request returns HTTP 404.
        cy.wait('@image404')
            .its('response.statusCode')
            .should('eq', 404)

        // Verify that the homepage remains visible after the image fails to load.
        cy.get('body')
            .should('be.visible')

        // Verify that the main homepage sections remain visible and accessible.
        const sections = ['.hero', '#booking', '#rooms', '#location', '#contact']

        sections.forEach((section) => {
            cy.get(section)
                .scrollIntoView()
                .should('be.visible')
        })
    })
})