describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        const user2 = {
            name: 'Test User',
            username: 'test',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user2)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('Log into Application')
        cy.get('#login-button').contains('Login')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
        
            cy.get('html')
                .should('contain', 'Matti Luukkainen is logged in')
        })

        it('fails with incorrect credentials', function() {
            cy.get('#username').type("sdfsdf")
            cy.get('#password').type("sdfsdf")
            cy.get('#login-button').click()

            cy.get('.error')
                .should('contain', 'Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'mluukkai', password: 'salainen'})
        })

        it('A blog can be created', function() {
            cy.get('button').contains('Create New Blog').click()
            cy.get('#title').type('1st test blog post')
            cy.get('#author').type('Matti')
            cy.get('#url').type('www.talksport.com')
            cy.get('#create-blog').click()
            cy.get('html').should('contain', '1st test blog post')
        })

        describe('After blog has been created', function() {
            beforeEach(function() {
                cy.createBlog({ title: '1st test blog post', author: 'Matti', url: 'www.talksport.com'})
                cy.createBlog({ title: 'No 2', author: 'Matti', url: 'www.youtube.com'})
                cy.createBlog({ title: 'No 3', author: 'Matti', url: 'www.youtube.com'})
            })

            it('A blog can be liked', function() {
                cy.contains('1st test blog post').contains('View').click()
                cy.contains('1st test blog post').contains('like').click()
                cy.contains('1st test blog post').find('.totalLikes').should('have.text', 1)


            })

            it('A blog can be deleted', function() {
                cy.contains('No 2').contains('View').click()
                cy.contains('No 2').find('.deleteButton').click()
                cy.get('html').should('contain', 'No 2 has been deleted')
            })

            it('Blog with most likes is listed first', function() {
                
                cy.contains('1st test blog post').contains('View').click()
                cy.contains('1st test blog post').contains('like').click()

                cy.contains('No 2').contains('View').click()
                cy.contains('No 2').contains('like').click()
                cy.wait(150)
                cy.contains('No 2').contains('like').click()
                
                cy.contains('No 3').contains('View').click()
                cy.contains('No 3').contains('like').click()
                cy.wait(150)
                cy.contains('No 3').contains('like').click()
                cy.wait(150)
                cy.contains('No 3').contains('like').click()
                cy.wait(150)

                cy.get('.blogStyling').then(list => {
                    let highest = +Cypress.$(list[0]).find('.totalLikes').text() + 1
                    list.each((item, element) => {
            
                        cy.wrap(Cypress.$(element)).find('.totalLikes').invoke('text').then(parseFloat).should('be.lt', highest)

                        highest = +Cypress.$(element).find('.totalLikes').text() + 1
                    })
                })         
            })   
        })
    })
})