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
  before(() => {});
  cy.visit('http://localhost:3000/login');
  cy.get('input[name="email"]').type('test@example.com');
  cy.get('input[name="password"]').type('admin');
  cy.get('form').submit();
  cy.waitUntil(() => cy.url().then((url) => url.includes('/home/dashboard')), {
    timeout: 10000,
    interval: 500,
  });

  it('Create Page Tests', () => {
    // navigates to group creation and adds a group', () => {
    cy.url().should('include', '/home/dashboard');
    cy.contains('button', 'Create Group').click();
    cy.waitUntil(() => cy.url().then((url) => url.includes('/home/create')), {
      timeout: 5000, // Wait for navigation to group creation
      interval: 500,
    });
    //allows a user to input a group name
    const groupName = 'New Test Group';
    cy.get('input#name').type(groupName).should('have.value', groupName);
    cy.wait(1500);
  
    //allows a user to search and select participants
    const participantName = 'Rollo';
    cy.get('input#search').type(participantName);
    cy.get('div[cmdk-group-items] button.flex.justify-between.items-center.w-full.p-2').click();
    cy.wait(1500);
  
    //allows a user to see selected participants
    cy.get('div[cmdk-list]').contains('Sebastian Arteaga').should('be.visible');
    cy.get('div[cmdk-list]').contains('Rollo KD').should('be.visible');
    cy.wait(1500);
  
    //allows a user to cancel the creation of a group
    cy.get('a[href="/dashboard"]').contains('Cancel').click();
    cy.url().should('include', '/dashboard');
    cy.wait(2000);
  
    // it('navigates to group creation and adds a group', () => {
    // cy.url().should('include', '/home/dashboard');
    // cy.contains('button', 'Create Group').click();
    // cy.waitUntil(() => cy.url().then((url) => url.includes('/home/create')), {
    //   timeout: 5000, // Wait for navigation to group creation
    //   interval: 500,
    // });
    // cy.wait(1500);
  
    // //allows a user to input a group name
    // const groupName1 = 'New Awesome Group';
    // cy.get('input#name').type(groupName1).should('have.value', groupName1);
    // cy.wait(1500);
  
    // //allows a user to search and select participants
    // const participantName1 = 'Gabe';
    // cy.get('input#search').type(participantName1);
    // cy.wait(1500);
  
    // //allows a user to see selected participants
    // cy.get('div[cmdk-list]').contains('Enes Jakupi').should('be.visible');
    // cy.wait(1500);
  
    // //allows a user to submit the form to create a group
    // cy.get('button[type="submit"]').contains('Create Group').click();
    // cy.wait(3000);
  
    // //redirects to the created group
    // cy.waitUntil(() => cy.url().then((url) => url.includes('/home/group')), {
    //   timeout: 5000,
    //   interval: 500,
    // });
  });
});

