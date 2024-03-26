describe('template spec', () => {
  before(() => {
    // Log in before tests
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('rollo@nextmail.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('form').submit();
    cy.url().should('include', '/dashboard');
  })

  it('displays the dashboard and groups', () => {
    cy.get('a[href*="home/group/e6c3862b-af96-4161-8768-f326e0bb73b8"]').click();
  })

  it('shows the group crumbs')
  it('shows balances', )
  it('shows transactions list', )
  it('shows settle up button', )
  it('transactions have options button', )
  it('edit button links to edit group page', )

})