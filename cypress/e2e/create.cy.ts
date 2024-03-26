import 'cypress-wait-until';

describe('Revised Workflow with Transaction Addition Fix', () => {
  before(() => {
    // Fill in the email and password fields
    cy.get('input[name="email"]').type('gabemata@gmail.com');
    cy.get('input[name="password"]').type('1010');
    // Submit the form
    cy.get('form').submit();
    //});
    //it('successfully creates group', () => {
    // Wait for the URL to change to the dashboard
    cy.url().should('include', '/home/dashboard');
    // Add assertions here to verify the login was successful
    cy.contains('button', 'Create Group', { timeout: 2000 }).should(
      'be.visible'
    );
  });

  it('Create Page Tests', () => {
    // Wait for the URL to change to /home/create

    cy.url().should('include', '/home/create');
    cy.get('input[name="name"]').type('Cypress testing');
    cy.get('input[name="search"]').type('seb');
    cy.contains('button', '+', { timeout: 2000 }).should('be.visible');

    cy.contains('button', '+').click();

    cy.contains('button', 'Create Group').click();
    cy.url().should('include', '/home/group');
    //});
    //it('sucssesfully adds transaction', () => {
    cy.contains('button', '+', { timeout: 2000 }).should('be.visible');
    cy.contains('button', '+').click();
    cy.get('input[name="name"]').type('Cypress testing');
    cy.get('input[name="amount"]').type('1000');
    cy.get('input[name="date"]').type('2024-03-22');
    cy.contains('button', 'Add Transaction', { timeout: 2000 }).should(
      'be.visible'
    );
    cy.contains('button', 'Add Transaction').click();
  });
});
