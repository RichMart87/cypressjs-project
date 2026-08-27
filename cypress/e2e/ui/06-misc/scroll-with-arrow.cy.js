'use strict';

const { homePage } = require('../../../support/pageObjects');

// Official scenario: Test Case 25 - Verify Scroll Up using 'Arrow' button and Scroll Down functionality
describe(
  "UI: Test Case 25 - Scroll up using the 'Arrow' button",
  { tags: ['@ui', '@regression'] },
  () => {
    it('scrolls to the subscription footer then back up via the arrow button', () => {
      homePage.visit();
      homePage.verifyHomePageIsVisible();

      homePage.scrollToBottom();
      homePage.verifySubscriptionHeadingIsVisible();

      homePage.clickScrollUpArrow();
      homePage.verifyTaglineIsVisible();
      cy.window().its('scrollY').should('eq', 0);
    });
  }
);
