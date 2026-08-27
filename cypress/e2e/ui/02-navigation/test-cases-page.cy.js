'use strict';

const { homePage, headerNav } = require('../../../support/pageObjects');

// Official scenario: Test Case 7 - Verify Test Cases Page
describe('UI: Test Case 7 - Verify Test Cases page', { tags: ['@ui', '@smoke'] }, () => {
  it('navigates to the Test Cases page from the header', () => {
    homePage.visit();
    homePage.verifyHomePageIsVisible();

    headerNav.goToTestCases();
    cy.url().should('include', '/test_cases');
    cy.contains('h2', 'Test Cases').should('be.visible');
  });
});
