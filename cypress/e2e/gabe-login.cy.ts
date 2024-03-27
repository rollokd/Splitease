

describe('LoginForm Test Suite', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
  
    it('Successfully logs in with valid credentials', () => {
      cy.get('input[name="email"]').type('gabemata@gmail.com');
      cy.get('input[name="password"]').type('1010');
      cy.get('form').submit();
      cy.url().should('include', '/home/dashboard'); 
    });
  });
  