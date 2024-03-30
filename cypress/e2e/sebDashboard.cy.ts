import 'cypress-wait-until';

describe('Revised Workflow on Dashboard', () => {
  // before(() => {});
  // cy.visit('http://localhost:3000/sigin');
  // cy.get('input[name="first-name"]').type('Test');
  // cy.get('input[name="last-name"]').type('Example');
  // cy.get('input[name="email"]').type('test@example.com');
  // cy.get('input[name="password"]').type('admin');
  // cy.get('form').submit();
  // cy.waitUntil(() => cy.url().then((url) => url.includes('/home/dashboard')), {
  //   timeout: 10000,
  //   interval: 500,
  // });
  before(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('admin');
    cy.get('form').submit();
    cy.waitUntil(() => cy.url().then((url) => url.includes('/home/dashboard')), {
      timeout: 10000,
      interval: 500,
    });
  })
  
  it('Create Page Tests', () => {
    cy.url().should('include', '/home/dashboard');
    cy.contains('button', 'Create Group').click();
    cy.waitUntil(() => cy.url().then((url) => url.includes('/home/create')), {
      timeout: 5000,
      interval: 500,
    });
    //allows a user to input a group name
    const groupName = 'New Test Group';
    cy.get('input#name').type(groupName).should('have.value', groupName);
    cy.wait(1500);
  
    //allows a user to search and select participants
    const participantName = 'Rollo';
    cy.get('input#search').type(participantName);
    cy.wait(500);
    cy.get('div[cmdk-list]').contains('Test Example').should('be.visible');
    cy.get('div[cmdk-list]').contains('Rollo KD').should('be.visible');
    //Click both Rollo and create group
    cy.contains('button', 'Rollo KD').click();
    cy.wait(1500);
    cy.contains('button', 'Create Group').click();
    //Wait for redirection
    cy.wait(2000);
    
    cy.contains('Balances').should('be.visible');
    cy.contains('Transactions').should('be.visible');
    
    cy.contains('button', '+').click();
    cy.wait(2000);
    cy.contains('Transaction name').should('be.visible');
    
    cy.get('input[name="name"]').type('Pizza test');
    cy.get('input[name="amount"]').type('50');
    cy.get('input[name="date"]').type('2024-03-22');
    cy.get('form').submit();
    cy.wait(2000);
    
    cy.contains('Test paid £50').should('be.visible');
    cy.contains('a', 'Dashboard').click();
    cy.waitUntil(() => cy.url().then((url) => url.includes('/home/dashboard')), {
      timeout: 10000,
      interval: 500,
    });
    cy.contains('button', 'Settle Up').click();
    cy.waitUntil(() => cy.url().then((url) => url.includes('/home/settle_up_dashboard')), {
      timeout: 10000,
      interval: 500,
    });
    //Check to see if there is a user 
    cy.contains('Rollo').should('be.visible');
    //Check for balances 
    cy.contains('25').should('be.visible');
    //Settle up 
    cy.contains('button', 'Settle').click();
    cy.wait(2000);
  });
});

