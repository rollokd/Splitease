describe('Dashboard Tests', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('http://localhost:3000/login');

    // Fill in the login form
    cy.get('input[name="email"]').type('gabemata@gmail.com');
    cy.get('input[name="password"]').type('1010');

    // Submit the form to log in
    cy.get('form').submit();

    // Add a check here to ensure the login was successful before proceeding
    // This could be checking for a URL change, looking for a log out button, etc.
    cy.url().should('include', '/dashboard');
  });

  it('displays the correct user balances and groups', () => {
    // Here you would add assertions specific to your dashboard's functionality and layout
    // For example, verifying that the "Groups" section is present
    cy.contains('Groups').should('be.visible');

    // Verify the presence of the "Balances" card with specific values if known
    cy.contains('Balances').should('be.visible');
    // Add more detailed checks as needed, such as checking for specific balance values

    // Check for the presence of the "Create Group" button
    cy.contains('Create Group +').should('be.visible');

    // Verify the "Settle Up" button is visible
    cy.contains('Settle Up').should('be.visible');

    // Optionally, navigate to one of the groups and perform checks within that context
    // Example: Verify that navigating to a specific group shows correct group details
  });

  // Add more tests as needed to cover other aspects of the dashboard functionality
});
