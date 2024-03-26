describe('Comprehensive User Workflow with Delays', () => {
  before(() => {
    // Log in before tests
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('enes@nextmail.com');
    cy.get('input[name="password"]').type('testing');
    cy.get('form').submit();
    cy.url().should('include', '/dashboard');
  });

  it('navigates to edit page, modifies a group, and checks redirection', () => {
    // Navigate to a specific group's page
    cy.get(
      'a[href*="/home/group/a2101f95-713c-41a0-9e14-61f125149d27"]'
    ).click();
    cy.url().should(
      'include',
      '/home/group/a2101f95-713c-41a0-9e14-61f125149d27'
    );

    // Navigate to the edit page for the group
    cy.get(
      'a[href*="/home/edit/a2101f95-713c-41a0-9e14-61f125149d27"]'
    ).click();
    cy.url().should(
      'include',
      '/home/edit/a2101f95-713c-41a0-9e14-61f125149d27'
    );
    //can navigate using breadcrumbs
    cy.get('nav[aria-label="breadcrumb"]').contains('Dashboard').click();
    cy.url().should('include', '/home/dashboard');
    // Navigate to a specific group's page
    cy.get(
      'a[href*="/home/group/a2101f95-713c-41a0-9e14-61f125149d27"]'
    ).click();
    cy.url().should(
      'include',
      '/home/group/a2101f95-713c-41a0-9e14-61f125149d27'
    );

    // Navigate to the edit page for the group
    cy.get(
      'a[href*="/home/edit/a2101f95-713c-41a0-9e14-61f125149d27"]'
    ).click();
    cy.url().should(
      'include',
      '/home/edit/a2101f95-713c-41a0-9e14-61f125149d27'
    );

    //can search for participants
    const searchQuery = 'Ola';
    cy.get('input#search').type(searchQuery);
    cy.get('div[cmdk-list]').should('contain', 'Search Results');
    //can add participants
    cy.get('svg.lucide-plus').click();
    cy.wait(2000);
    //can cancel and return to the dashboard
    cy.get('a[href="/dashboard"]').click();
    cy.url().should('include', '/dashboard');
    // Navigate to a specific group's page
    cy.get(
      'a[href*="/home/group/a2101f95-713c-41a0-9e14-61f125149d27"]'
    ).click();
    cy.url().should(
      'include',
      '/home/group/a2101f95-713c-41a0-9e14-61f125149d27'
    );

    // Navigate to the edit page for the group
    cy.get(
      'a[href*="/home/edit/a2101f95-713c-41a0-9e14-61f125149d27"]'
    ).click();
    cy.url().should(
      'include',
      '/home/edit/a2101f95-713c-41a0-9e14-61f125149d27'
    );
    //can edit the group name
    const newName = 'New Group Name';
    cy.get('input#name').clear().type(newName);
    cy.get('input#name').should('have.value', newName);
    // can submit the form to edit the group
    cy.get('form').within(() => {
      cy.root().submit();
    });
  });
});
