describe('Login Form', () => {
  it('successfully edits page', () => {
    // Visit the page where the login form is located
    cy.visit('http://localhost:3000/login');

    // Fill in the email and password fields
    cy.get('input[name="email"]').type('enes@nextmail.com');
    cy.get('input[name="password"]').type('testing');
    // Submit the form
    cy.get('form').submit();

    // Wait for the URL to change to the dashboard
    cy.url().should('include', '/dashboard');
    // Add assertions here to verify the login was successful
    cy.get(
      'a[href*="/home/group/837d853b-0a1d-4807-af0b-8c1551287a89"]'
    ).click();

    // Wait for the URL to change to /home/group
    cy.url().should('include', '/home/group');
    cy.get(
      'a[href*="/home/edit/837d853b-0a1d-4807-af0b-8c1551287a89"]'
    ).click();
    cy.get('input[name="name"]').type('Cypress testing Edit');
    cy.get('form[name="user"]').type('gabe');
    cy.contains('button', '+', { timeout: 2000 }).should('be.visible');
    cy.contains('button', '+').click();
    cy.get('span').should('have.text', 'Sebastian');
    cy.contains('button', '-', { timeout: 2000 }).should('be.visible');
    cy.contains('button', '-').click();
    cy.contains('button', 'Edit Group').click();
    cy.url().should('include', '/home/group');
  });
});
