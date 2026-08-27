'use strict';

const { homePage } = require('../../../support/pageObjects');

// Official scenario: Test Case 26 - Verify Scroll Up without 'Arrow' button and Scroll Down functionality
describe(
  "UI: Test Case 26 - Scroll up without the 'Arrow' button",
  { tags: ['@ui', '@regression'] },
  () => {
    it('scrolls to the subscription footer then back up programmatically', () => {
      homePage.visit();
      homePage.verifyHomePageIsVisible();

      homePage.scrollToBottom();
      homePage.verifySubscriptionHeadingIsVisible();

      homePage.scrollToTop();
      homePage.verifyTaglineIsVisible();
      cy.window().its('scrollY').should('eq', 0);
    });
  }
);
