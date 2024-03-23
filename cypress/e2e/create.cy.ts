describe('Login Form', () => {
  it('successfully logs in', () => {
    // Visit the page where the login form is located
    cy.visit('http://localhost:3000/login');

    // Fill in the email and password fields
    cy.get('input[name="email"]').type('enes@nextmail.com');
    cy.get('input[name="password"]').type('testing');
    // Submit the form
    cy.get('form').submit();
  });
  it('successfully creates group', () => {
    // Wait for the URL to change to the dashboard
    cy.url().should('include', '/dashboard');
    // Add assertions here to verify the login was successful
    cy.contains('button', 'Create Group', { timeout: 2000 }).should(
      'be.visible'
    );
    cy.contains('button', 'Create Group').click();

    // Wait for the URL to change to /home/create
    cy.url().should('include', '/home/create');
    cy.get('input[name="name"]').type('Cypress testing');
    cy.get('form[name="user"]').type('seb');
    cy.contains('button', '+', { timeout: 2000 }).should('be.visible');
    cy.contains('button', '+').click();
    cy.contains('button', 'Create Group').click();
    cy.url().should('include', '/home/group');
  });
  it('sucssesfully adds transaction', () => {
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
