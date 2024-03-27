describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('gabemata@gmail.com');
    cy.get('input[name="password"]').type('1010');
    cy.get('form').submit();
    cy.url().should('include', '/dashboard');
  });
  it(`Displays heading 
  Balances
  Groups`, () => {
    cy.contains('Groups').should('be.visible');
    cy.contains('Balances').should('be.visible');
  });
  it(`Should display buttons:
  Create Group 
  Settle Up`, () => {
    cy.contains('Create Group +').should('be.visible');
    cy.contains('Settle Up').should('be.visible');
  });

  it(`Navigates to:  
  Create group page when "Create Group" is clicked`, () => {
    cy.contains('button', 'Create Group').click();
    cy.url().should('include', '/home/create');
  });
});
