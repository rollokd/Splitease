describe('Login Form', () => {
  it('successfully logs in', () => {
    // Visit the page where the login form is located
    cy.visit('http://localhost:3000/login');

    // Fill in the email and password fields
    cy.get('input[name="email"]').type('gabemata@gmail.com');
    cy.get('input[name="password"]').type('1010');
    // Submit the form
    cy.get('form').submit();
  });
});
