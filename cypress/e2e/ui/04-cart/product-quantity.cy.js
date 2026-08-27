'use strict';

const {
  homePage,
  productsPage,
  productDetailPage,
  cartPage,
} = require('../../../support/pageObjects');

// Official scenario: Test Case 13 - Verify Product quantity in Cart
describe('UI: Test Case 13 - Verify Product quantity in Cart', { tags: ['@ui', '@smoke'] }, () => {
  it('carries a custom quantity through to the cart', () => {
    const desiredQuantity = 4;

    homePage.visit();
    homePage.verifyHomePageIsVisible();

    productsPage.viewProductByIndex(0);
    productDetailPage.verifyProductDetailIsVisible();

    cy.get('#product_id')
      .invoke('val')
      .then((productId) => {
        productDetailPage.setQuantity(desiredQuantity);
        productDetailPage.addToCart();
        productDetailPage.viewCartFromModal();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.verifyProductInCart(productId, { quantity: desiredQuantity });
      });
  });
});
