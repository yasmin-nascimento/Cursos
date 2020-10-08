/// <reference types = "cypress" />
/// <reference types = "@bahmutov/cy-api" />

describe('Teste API Rest', () => {
  //let token

  before(() => {
    cy.getToken('yasmin@teste.com.br', '1234')
    //.then(tkn => {
    //  token = tkn
    //})
  })

  beforeEach(() => {
    cy.resetRest()
  })

  it('Inserir Conta', () => {
    cy.api({
      url: '/contas',
      method: 'POST',
      //headers: { Authorization: `JWT ${token}` },
      body: {
        nome: 'Conta B'
      }
    }).as('response')

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(201)
      expect(res.body).to.have.property('id')
      expect(res.body).to.has.property('nome', 'Conta B')
    })
  })

  it('Alterar Conta', () => {
    cy.getContaByName('Conta para alterar').then(contaID => {
      cy.api({
        url: `/contas/${contaID}`,
        method: 'PUT',
        //headers: { Authorization: `JWT ${token}` },
        body: {
          nome: 'Conta alterada via rest'
        }
      }).as('response')
      cy.get('@response').its('status').should('be.equal', 200)
    })
  })

  it('Inserir Conta Repetida', () => {
    cy.api({
      url: '/contas',
      method: 'POST',
      //headers: { Authorization: `JWT ${token}` },
      body: {
        nome: 'Conta mesmo nome'
      },
      failOnStatusCode: false
    }).as('response')

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(400)
      expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
    })
  })

  it('Inserir Movimentação', () => {
    cy.getContaByName('Conta para movimentacoes').then(contaID => {
      cy.api({
        url: '/transacoes',
        method: 'POST',
        //headers: { Authorization: `JWT ${token}` },
        body: {
          conta_id: contaID,
          data_pagamento: Cypress.moment().add({ days: 4 }).format('DD/MM/YYYY'),
          data_transacao: Cypress.moment().format('DD/MM/YYYY'),
          descricao: 'Recebimento Bônus',
          envolvido: 'Interessado Teste',
          status: true,
          tipo: 'REC',
          valor: '2000'
        }
      }).as('response')
    })
    cy.get('@response').its('status').should('be.equal', 201)
    cy.get('@response').its('body.id').should('exist')
  })

  it('Saldo', () => {
    cy.api({
      url: '/saldo',
      method: 'GET'
      //headers: { Authorization: `JWT ${token}` }
    }).then(res => {
      let saldoConta = null
      res.body.forEach(c => {
        if (c.conta === 'Conta para saldo') saldoConta = c.saldo
      })
      expect(saldoConta).to.be.equal('534.00')
    })

    cy.api({
      url: '/transacoes',
      method: 'GET',
      //headers: { Authorization: `JWT ${token}` },
      qs: { descricao: 'Movimentacao 1, calculo saldo' }
    }).then(res => {
      cy.api({
        url: `/transacoes/${res.body[0].id}`,
        method: 'PUT',
        //headers: { Authorization: `JWT ${token}` },
        body: {
          status: true,
          data_transacao: Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
          data_pagamento: Cypress.moment(res.body[0].data_oagamento).format('DD/MM/YYYY'),
          descricao: res.body[0].descricao,
          envolvido: res.body[0].envolvido,
          valor: res.body[0].valor,
          conta_id: res.body[0].conta_id
        }
      })
        .its('status')
        .should('be.equal', 200)
    })

    cy.api({
      url: '/saldo',
      method: 'GET'
      //headers: { Authorization: `JWT ${token}` }
    }).then(res => {
      let saldoConta = null
      res.body.forEach(c => {
        if (c.conta === 'Conta para saldo') saldoConta = c.saldo
      })
      expect(saldoConta).to.be.equal('4034.00')
    })
  })
  it('Remover Movimentação', () => {
    cy.api({
      url: '/transacoes',
      method: 'GET',
      //headers: { Authorization: `JWT ${token}` },
      qs: { descricao: 'Movimentacao para exclusao' }
    }).then(res => {
      cy.api({
        url: `/transacoes/${res.body[0].id}`,
        method: 'DELETE'
        //headers: { Authorization: `JWT ${token}` }
      })
        .its('status')
        .should('be.equal', 204)
    })
  })
})
