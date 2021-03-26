describe('The Photography App Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
  })
  it('Succesfully loads the website', () => {
    cy.contains('PHOTOGRAPH')
  })
})
