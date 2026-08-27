'use strict';

const { homePage, headerNav, loginPage, signupPage } = require('../../../support/pageObjects');
const { buildRandomUser, toAccountApiPayload } = require('../../../utils/dataGenerator');
const invalidUser = require('../../../fixtures/invalidUser.json');

// Official scenario: Test Case 2 - Login User with correct email and password
describe('UI: Test Case 2 - Login with correct credentials', { tags: ['@ui', '@smoke'] }, () => {
  const user = buildRandomUser();

  before(() => {
    cy.createUserViaApi(toAccountApiPayload(user));
  });

  it('logs in and deletes the account', () => {
    homePage.visit();
    homePage.verifyHomePageIsVisible();

    headerNav.goToSignupLogin();
    loginPage.verifyLoginFormIsVisible();
    loginPage.login(user.email, user.password);

    headerNav.verifyLoggedInAs(user.name);

    headerNav.deleteAccount();
    signupPage.verifyAccountDeleted();
  });
});

// Official scenario: Test Case 3 - Login User with incorrect email and password
describe(
  'UI: Test Case 3 - Login with incorrect credentials',
  { tags: ['@ui', '@regression'] },
  () => {
    it('shows an inline error and does not log in', () => {
      homePage.visit();
      homePage.verifyHomePageIsVisible();

      headerNav.goToSignupLogin();
      loginPage.verifyLoginFormIsVisible();
      loginPage.login(invalidUser.email, invalidUser.password);
      loginPage.verifyLoginErrorIsVisible();
    });
  }
);

// Official scenario: Test Case 4 - Logout User
describe('UI: Test Case 4 - Logout', { tags: ['@ui', '@regression'] }, () => {
  const user = buildRandomUser();

  before(() => {
    cy.createUserViaApi(toAccountApiPayload(user));
  });

  after(() => {
    // Best-effort cleanup: ignore failures if the account is already gone.
    cy.deleteUserViaApi(user.email, user.password);
  });

  it('logs out and returns to the login page', () => {
    homePage.visit();
    headerNav.goToSignupLogin();
    loginPage.verifyLoginFormIsVisible();
    loginPage.login(user.email, user.password);
    headerNav.verifyLoggedInAs(user.name);

    headerNav.logout();
    cy.url().should('include', '/login');
    loginPage.verifyLoginFormIsVisible();
  });
});
