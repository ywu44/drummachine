describe('app starts', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200/')
    cy.get('#bpm').should('have.value',135);
    cy.get('#bars').should('have.value',16);
    cy.get('.playButton').should('exist');
  });
  it('open preset panel to choose', () => {
    cy.visit('http://localhost:4200/')
    cy.get('#presetButton').click();
    cy.get('.preset').eq(1).click();
    cy.get('.playButton').should('exist').click();
    cy.get('.stopButton').should('exist').click();
    cy.get('#presetButton').click();
    cy.get('.working').click();
  })
  it('should upload file', () => {
    cy.visit('http://localhost:4200/')
    cy.get('input[type=file]').should('exist');
    cy.get('input[type=file]').selectFile('cypress/fixtures/example.wav', {force: true});
    cy.get('input[name=fileName]').type('example')
    cy.get('input[name=trigger]').type('z')
    cy.contains('Cancel').click();
    // cy.contains('Upload').click();
  })
})