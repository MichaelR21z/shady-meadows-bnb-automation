describe('Administrator Authentication', () => {
    const username = Cypress.env('adminUsername')
    const password = Cypress.env('adminPassword')

    const invalidUsername = "Michael"
    const invalidPassword = "helloworld123"
    // ------------------------------------------------------------------------

    context('Happy Path', () => {
        it('Should authenticate an administrator using the login API', () => {
            // Authenticate through the API and open a protected page.
            cy.loginAPI()
            cy.visit('/admin/rooms')

            // Verify that the user is redirected to the admin dashboard.
            cy.url().should('include', '/admin/rooms')
        })

        it('Should authenticate an administrator through the login page', () => {
            // Log in using the UI with valid credentials.
            cy.loginUI(username, password)

            // Verify that the user is redirected to the dashboard.
            cy.url().should('include', '/admin/rooms')
        })

        it('Should log out an administrator from the user interface', () => {
            // Authenticate through the API and open a protected page.
            cy.loginAPI()
            cy.visit('/admin/rooms')

            // Verify that authentication was successful.
            cy.url().should('include', '/admin/rooms')

            // Log out and verify that the user is redirected to the public homepage.
            cy.contains('Logout').click()
            cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
        })

        it('Should redirect to login when the session token is invalid', { tags: ['@smoke'] }, () => {
            // Start with a valid authenticated session.
            cy.loginAPI()

            // Mock the session validation response to test how the UI reacts
            // without depending on the real backend or waiting five minutes.
            cy.intercept('POST', '**/api/auth/validate', {
                statusCode: 403,
                body: { error: 'Invalid token' }
            }).as('validateSession')

            // Visit a protected page so the app performs the validation request.
            cy.visit('/admin/rooms')

            // Verify that the backend validation returned 403.
            cy.wait('@validateSession')
                .its('response.statusCode')
                .should('eq', 403)

            // Verify that the user is no longer in the protected area.
            cy.url().should('not.include', '/rooms')
            cy.get('form').should('be.visible')
        })

        it('Should expire the administrator session after five minutes', { tags: ['@regression', '@slow'] }, () => {
            // Authenticate through the API and open a protected page.
            cy.loginAPI()
            cy.visit('/admin/rooms')

            // Wait five minutes to allow the administrator session to expire.
            cy.wait(5 * 60 * 1000)

            // Listen for the session validation request before triggering it.
            cy.intercept('POST', '**/api/auth/validate').as('validateSession')

            // Attempt to access another protected page after the timeout.
            cy.get('#reportLink').click()

            // Verify that the backend rejects the expired session.
            cy.wait('@validateSession').its('response.statusCode')
                .should('eq', 403)

            // Verify that the administrator is redirected to the login page
            cy.url().should('eq', `${Cypress.config('baseUrl')}/admin`)
            cy.get('form').should('be.visible')
        })

        it('TC35 - Intentar reutilizar un token después de que la sesión haya expirado', () => {

            //Login
            cy.loginAPI().then((token) => {
                cy.log('Token obtenido correctamente: ' + token)

                 // Esperar 5 minutos para que expire el token
                cy.log('Esperando 5 minutos para que expire el token...')
                cy.wait(5 * 60 * 1000)

                cy.request({
                    method: 'GET',
                    url: `${Cypress.config('baseUrl')}/api/branding`,
                    headers: {
                        Cookie: `token=${token}`
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    cy.log(`Validación después de la expiración: ${response.status}`)
                    expect(response.status).to.eq(200)
                })
            })
        })

        it('Should keep expiring the session at 5 minutes even with continuous activity', { tags: ['@regression', '@slow'] }, () => {
            // Authenticate through the API and open a protected page.
            cy.loginAPI()
            cy.visit('/admin/rooms')

            // Simulate user activity by reloading the page every minute.
            // This verifies that activity does not extend the session lifetime.
            for (let i = 0; i < 4; i++) {
                cy.wait(60 * 1000)
                cy.reload()
            }

            // Wait an extra margin so the timeout is clearly exceeded.
            cy.wait(90 * 1000)

            // Listen for the next session validation request.
            cy.intercept('POST', '**/api/auth/validate').as('validateSession')

            // Trigger a protected navigation after the timeout.
            cy.visit('/admin/report')

            // Verify that the backend rejects the expired token.
            cy.wait('@validateSession')
                .its('response.statusCode')
                .should('eq', 403)

            // Verify that the user is redirected to the login page.
            cy.url().should('eq', `${Cypress.config('baseUrl')}/admin`)
            cy.get('form').should('be.visible')
        })
    })

    context('Negative Tests', () => {
        it('Should reject invalid administrator credentials', () => {
            // Log in using invalid credentials.
            cy.loginUI(invalidUsername, invalidPassword)

            // Verify that authentication fails and the user stays on the login page.
            cy.contains('Invalid credentials').should('be.visible')
            cy.url().should('eq', `${Cypress.config('baseUrl')}/admin`)
        })
    })

    context('Reports Bugs', () => {

        // No es un Bug 
        it('Should invalidate the token after logout', () => {

            cy.loginAPI().then((response) => {

                const token = response.body.token;

                // Store the token in a cookie to simulate an authenticated session.
                cy.setCookie('token', token);

                cy.visit('/admin/rooms');
                cy.contains('Logout').click();


                cy.validateToken(token).then((validateResponse) => {
                    // Verify that the backend rejects the token after logout.
                    expect(validateResponse.status).to.eq(403);
                })
            })
        })

        it('SMB-57: Protected pages remain accessible after logout', () => {
            cy.loginAPI()
            cy.visit('/admin/rooms')
            cy.url().should('include', '/admin/rooms')

            // Log out and verify the redirect to the homepage.
            cy.contains('Logout').click()
            cy.url().should('eq', `${Cypress.config('baseUrl')}/`)

            // Attempt to access a protected page after logout.
            cy.visit('/admin/report')
            cy.wait(500)
            cy.url().should('include', '/admin/report')
        })

        // Verify the logout endpoint response observed in Postman.
        it('SMB-58: Endpoint returns HTTP 500 instead of HTTP 200', () => {
            cy.loginAPI()

            // Send the logout request and allow Cypress to continue even if the server
            // returns an error status code.
            cy.request({
                method: 'POST',
                url: `${Cypress.config('baseUrl')}/api/auth/logout`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(500) // Update to 200 when the backend is fixed.
            })
        })
    })
})
