describe('Logout Functionality', () => {
  beforeEach(() => {
    // Direct Cypress to your application's login page
    cy.visit('http://localhost:3000/login');

    // Perform login operations
    cy.get('input[name="email"]').type('gabemata@gmail.com');
    cy.get('input[name="password"]').type('1010', { log: false }); // Use `{ log: false }` to hide sensitive data from Cypress logs
    cy.get('form').submit();

    // Ensure the login was successful before proceeding, e.g., by checking for a redirect to the dashboard
    cy.url().should('include', 'home/dashboard');
  });

  it('successfully logs out and redirects to the login page', () => {
    // Find and click the logout button
    // Adjust the selector as needed to target the logout button specifically
    cy.get('button[aria-label="Logout"]').click(); // This assumes your logout button contains text 'Logout'

    // Verify that the application redirected to the login page
    cy.url().should('include', '/login');

    // Check that the email and password fields are empty
    cy.get('input[name="email"]').should('have.value', '');
  });
});
