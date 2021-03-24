/// <reference types="cypress" />

let numPersons = null

describe('The ultimate test for the birthday app', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
    cy.get('img', { timeout: 10000 })
  })
  it('Has a working name filter', () => {
    cy.get('img').then(persons => {
      numPersons = persons.length
    })
    cy.get('input').type('C')
    cy.get('img').then(persons => expect(persons.length).to.be.lessThan(numPersons))
  })
  it('resets the name filter', () => {
    cy.get('input').clear()
    cy.get('img').then(persons => expect(persons.length).to.be.equal(numPersons))
  })
  it('has a working month filter', () => {
    cy.get('select').select('September')
    cy.get('img').then(persons => expect(persons.length).to.be.lessThan(numPersons))
  })
  it('resets the month filter', () => {
    cy.get('select').select('Select a month')
    cy.get('img').then(persons => expect(persons.length).to.be.equal(numPersons))
  })
  it('Both filters work together', () => {
    let filteredNumPeople = null
    cy.get('input').type('C')
    cy.get('img').then(persons => (filteredNumPeople = persons.length))
    cy.get('select').select('September')
    cy.get('img').then(persons =>
      expect(persons.length).to.be.lessThan(numPersons).and.to.be.lessThan(filteredNumPeople)
    )
  })

  it('has a button to add people', () => {
    cy.contains('Add somebody').click()
    cy.get('form').should('be.visible')
  })
  it('checks for first name', () => {
    cy.contains('Add somebody').click()
    cy.get('form').contains('Lastname').click().type('Goeldel')
    cy.get('form').get('input[type=date]').click().type('2002-09-14')
    cy.get('form').contains('Avatar image').click().type('https://www.dings.de')
    cy.get('form').contains('Submit').click()
    cy.get('form').should('be.visible')
  })
  it('checks for last name', () => {
    cy.contains('Add somebody').click()
    cy.get('form').contains('Firstname').click().type('Constantin')
    cy.get('form').get('input[type=date]').click().type('2002-09-14')
    cy.get('form').contains('Avatar image').click().type('https://www.dings.de')
    cy.get('form').contains('Submit').click()
    cy.get('form').should('be.visible')
  })
  it('checks for wrong date', () => {
    cy.contains('Add somebody').click()
    cy.get('form').contains('Firstname').click().type('Constantin')
    cy.get('form').contains('Lastname').click().type('Goeldel')
    cy.get('form').get('input[type=date]').click().type('2022-09-14')
    cy.get('form').contains('Avatar image').click().type('https://www.dings.de')
    cy.get('form').contains('Submit').click()
    cy.get('form').should('be.visible')
  })
  it('checks for wrong url', () => {
    cy.contains('Add somebody').click()
    cy.get('form').contains('Firstname').click().type('Constantin')
    cy.get('form').contains('Lastname').click().type('Goeldel')
    cy.get('form').get('input[type=date]').click().type('2002-09-14')
    cy.get('form').contains('Avatar image').click().type('wrong url')
    cy.get('form').contains('Submit').click()
    cy.get('form').should('be.visible')
  })
  it('Submits when everything is correct', () => {
    cy.contains('Add somebody').click()
    cy.get('form').contains('Firstname').click().type('Constantin')
    cy.get('form').contains('Lastname').click().type('Goeldel')
    cy.get('form').get('input[type=date]').click().type('2002-09-14')
    cy.get('form').contains('Avatar image').click().type('wrong url')
    cy.get('form').contains('Submit').click()
    cy.get('form').should('not.be.visible')
    cy.get('img').then(persons => expect(persons.length).to.be.equal(numPersons + 1))
  })
  it('deletes users', () => {
    cy.get('svg[fill="#EF4565"]')
      .parent()
      .then(allDeleteButtons => {
        const deleteButton = allDeleteButtons[0]
        deleteButton.click()
        cy.contains('Delete').click()
      })
    cy.get('img').then(persons => expect(persons.length).to.be.equal(numPersons - 1))
  })
})
