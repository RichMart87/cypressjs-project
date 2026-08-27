'use strict';

const { homePage, headerNav, loginPage, signupPage } = require('../../../support/pageObjects');
const { buildRandomUser } = require('../../../utils/dataGenerator');

// Official scenario: automationexercise.com/test_cases -> Test Case 1: Register User
describe('UI: Test Case 1 - Register User', { tags: ['@ui', '@smoke'] }, () => {
  it('registers a new user end-to-end and cleans up the account', () => {
    const user = buildRandomUser();

    homePage.visit();
    homePage.verifyHomePageIsVisible();

    headerNav.goToSignupLogin();
    loginPage.verifySignupFormIsVisible();
    loginPage.signup(user.name, user.email);

    signupPage.verifyAccountInfoFormIsVisible();
    signupPage.registerNewUser(user);

    headerNav.verifyLoggedInAs(user.name);

    headerNav.deleteAccount();
    signupPage.verifyAccountDeleted();
    signupPage.continueToAccount();
    homePage.verifyHomePageIsVisible();
  });
});
