'use strict';

const { homePage, cartPage } = require('../../../support/pageObjects');

// Official scenario: Test Case 22 - Add to cart from Recommended items
describe(
  'UI: Test Case 22 - Add to cart from Recommended items',
  { tags: ['@ui', '@regression'] },
  () => {
    it('adds a recommended product to the cart from the home page', () => {
      homePage.visit();
      homePage.verifyHomePageIsVisible();

      homePage.scrollToBottom();
      homePage.verifyRecommendedItemsVisible();

      homePage.addFirstRecommendedItemToCart();
      homePage.viewCartFromModal();

      cartPage.verifyCartPageIsDisplayed();
      cartPage.getRowCount().should('have.length', 1);
    });
  }
);
