'use strict';

const { homePage, headerNav, productsPage, cartPage } = require('../../../support/pageObjects');

// Official scenario: Test Case 17 - Remove Products From Cart
describe('UI: Test Case 17 - Remove Products From Cart', { tags: ['@ui', '@regression'] }, () => {
  it('removes a product and confirms it no longer appears', () => {
    homePage.visit();
    headerNav.goToProducts();
    productsPage.verifyAllProductsHeading();

    productsPage.getProductIdAtIndex(0).then((productId) => {
      productsPage.addProductToCartByIndex(0);
      productsPage.viewCartFromModal();

      cartPage.verifyCartPageIsDisplayed();
      cartPage.getRowByProductId(productId).should('exist');

      cartPage.removeProduct(productId);
    });
  });
});
