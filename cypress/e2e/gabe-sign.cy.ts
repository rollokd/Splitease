describe('Complete User Journey Test', () => {
  it('signs up a new user, logs them in, and navigates to the dashboard', () => {
    cy.visit('http://localhost:3000/sign'); // Adjust the URL to where your sign-up form is located

    // Using a dynamic email to ensure the test can run multiple times without user duplication issues
    const testEmail = `test${Date.now()}@example.com`;

    // Fill out and submit the sign-up form
    cy.get('input[name="first-name"]').type('Test');
    cy.get('input[name="last-name"]').type('User');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('testpassword');
    cy.get('form').submit();

    // Assert navigation to the login page after sign-up
    cy.url().should('include', '/login');

    // Perform login with the newly created user credentials
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('testpassword');
    cy.get('form').submit();

    // Assert navigation to the dashboard after login
    cy.url().should('include', '/home/dashboard'); // Make sure this matches your app's dashboard path

    // Optional: Add more assertions here to check for elements unique to the dashboard page
    // For example, checking for a welcome message or specific dashboard controls
    cy.contains('Balances').should('be.visible'); // Adjust based on actual dashboard content
  });

  describe('Sign Up Error Handling', () => {
    it('displays an error when signing up with an email that already exists', () => {
      cy.visit('http://localhost:3000/sign'); // Adjust if your sign-up page is located elsewhere
  
      // Assuming "Gabe Mata" is an existing user and "gabemata@gmail.com" is the email already taken
      // Fill out the form with the existing user's information
      cy.get('input[name="first-name"]').type('Gabe');
      cy.get('input[name="last-name"]').type('Mata');
      cy.get('input[name="email"]').type('gabemata@gmail.com'); // Email already registered
      cy.get('input[name="password"]').type('aSecurePassword'); // Dummy password
  
      // Submit the form
      cy.get('form').submit();
  
      // Now, we need to check for an error message indicating the email is already in use
      // The exact method to do this will depend on how your application displays error messages
      // Here's an example that checks for text content within an alert or error message component
      cy.contains('Email already exists').should('be.visible');
      // Adjust the text 'Email already exists' according to the actual error message your application uses
    });
  });
  
});
