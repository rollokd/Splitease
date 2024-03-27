describe('Logout Functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('gabemata@gmail.com');
    cy.get('input[name="password"]').type('1010', { log: false }); 
    cy.get('form').submit().click();
    cy.url().should('include', 'home/dashboard');
  });

  it('successfully logs out and redirects to the login page', () => {
    cy.get('button[aria-label="Logout"]').click(); 
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').should('have.value', '');
  });
});
