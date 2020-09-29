/// <reference types = "cypress" />

describe (' Desafio', () => {
    before (() => {
        cy.visit('http://www.wcaquino.me/cypress/componentes.html')
    })
    beforeEach (() => {
        cy.reload()
    })

    it('Cadastrar Nome', () => {
        const stub = cy.stub().as('alerta')
        cy.on('window:alert', stub)
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio'))
        
        cy.get('#formNome').type('Meu primeiro nome')
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio'))

        cy.get('[data-cy=dataSobrenome]').type('Meu Sobrenome')
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio'))

        cy.get('#formSexoFem').click()
        cy.get('#formCadastrar').click()

        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')



        
    })
})