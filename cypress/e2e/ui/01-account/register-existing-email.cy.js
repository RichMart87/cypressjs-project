'use strict';

const { homePage, headerNav, loginPage } = require('../../../support/pageObjects');
const { buildRandomUser, toAccountApiPayload } = require('../../../utils/dataGenerator');

// Official scenario: Test Case 5 - Register User with existing email
describe(
  'UI: Test Case 5 - Register with an existing email',
  { tags: ['@ui', '@regression'] },
  () => {
    const existingUser = buildRandomUser();

    before(() => {
      // Seed a real account via the API so the "already exists" branch is
      // exercised deterministically, without relying on a hard-coded fixture
      // email that could collide with other runs on the shared sandbox site.
      cy.createUserViaApi(toAccountApiPayload(existingUser));
    });

    after(() => {
      cy.deleteUserViaApi(existingUser.email, existingUser.password);
    });

    it('shows an inline error and does not create a duplicate account', () => {
      homePage.visit();
      homePage.verifyHomePageIsVisible();

      headerNav.goToSignupLogin();
      loginPage.verifySignupFormIsVisible();
      loginPage.signup(existingUser.name, existingUser.email);
      loginPage.verifySignupErrorIsVisible();
    });
  }
);
