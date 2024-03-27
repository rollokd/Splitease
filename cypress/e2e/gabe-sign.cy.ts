describe('Complete User Journey Test', () => {
  it('signs up a new user, logs them in, and navigates to the dashboard', () => {
    cy.visit('http://localhost:3000/sign'); 
    const testEmail = `test${Date.now()}@example.com`;
    cy.get('input[name="first-name"]').type('Test');
    cy.get('input[name="last-name"]').type('User');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('testpassword');
    cy.get('form').submit();

    cy.url().should('include', '/login');

    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('testpassword');
    cy.get('form').submit();

    cy.url().should('include', '/home/dashboard'); 
    cy.contains('Balances').should('be.visible'); 
  });

  describe('Sign Up Error Handling', () => {
    it('displays an error when signing up with an email that already exists', () => {
      cy.visit('http://localhost:3000/sign'); 
      cy.get('input[name="first-name"]').type('Gabe');
      cy.get('input[name="last-name"]').type('Mata');
      cy.get('input[name="email"]').type('gabemata@gmail.com'); 
      cy.get('input[name="password"]').type('aSecurePassword'); 
      cy.get('form').submit();
  
      cy.contains('Email already exists').should('be.visible');
    });
  });
  
});
