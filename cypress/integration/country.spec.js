describe('The Country Quiz Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
  })
  it('Succesfully loads the website', () => {
    cy.contains('COUNTRY QUIZ')
  })
  it('Has four options to pick from', () => {
    cy.contains('A')
    cy.contains('B')
    cy.contains('C')
    cy.contains('D')
  })
})
