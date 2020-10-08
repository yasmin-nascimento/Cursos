// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getToken', (user, passwd) => {
  cy.request({
    url: '/signin',
    method: 'POST',
    body: {
      email: user,
      redirecionar: false,
      senha: passwd
    }
  })
    .its('body.token')
    .should('not.be.empty')
    .then(token => {
      Cypress.env('token', token)
      return token
    })
})

Cypress.Commands.add('resetRest', () => {
  cy.getToken('yasmin@teste.com.br', '1234').then(token => {
    cy.request({
      url: '/reset',
      method: 'GET',
      headers: { Authorization: `JWT ${token}` }
    })
      .its('status')
      .should('be.equal', 200)
  })
})

Cypress.Commands.add('getContaByName', name => {
  cy.getToken('yasmin@teste.com.br', '1234').then(token => {
    cy.request({
      url: '/contas',
      method: 'GET',
      headers: { Authorization: `JWT ${token}` },
      qs: {
        nome: name
      }
    }).then(res => {
      return res.body[0].id
    })
  })
})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  if (options.length == 1) {
    if (Cypress.env('token')) {
      options[0].headers = {
        Authorization: `JWT ${Cypress.env('token')}`
      }
    }
  }

  return originalFn(...options)
})
