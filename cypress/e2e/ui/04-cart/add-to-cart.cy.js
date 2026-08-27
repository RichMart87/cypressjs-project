'use strict';

const { homePage, headerNav, productsPage, cartPage } = require('../../../support/pageObjects');

// Official scenario: Test Case 12 - Add Products in Cart
describe('UI: Test Case 12 - Add Products in Cart', { tags: ['@ui', '@smoke'] }, () => {
  it('adds two products and verifies price, quantity and total in the cart', () => {
    homePage.visit();
    headerNav.goToProducts();
    productsPage.verifyAllProductsHeading();

    productsPage.getProductIdAtIndex(0).then((firstId) => {
      productsPage.addProductToCartByIndex(0);
      productsPage.continueShopping();

      productsPage.getProductIdAtIndex(1).then((secondId) => {
        productsPage.addProductToCartByIndex(1);
        productsPage.viewCartFromModal();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.getRowCount().should('have.length', 2);

        [firstId, secondId].forEach((productId) => {
          // Re-query the row fresh for each assertion rather than reusing one
          // stored chainable: Cypress commands queue sequentially, so a second
          // `.find()` off a saved chainable would run against the *previous*
          // find's result instead of re-selecting the row.
          cartPage.getRowByProductId(productId).should('exist');
          cartPage
            .getRowByProductId(productId)
            .find('.cart_quantity button')
            .should('contain.text', '1');
          cartPage
            .getRowByProductId(productId)
            .find('.cart_price p')
            .invoke('text')
            .then((priceText) => {
              cartPage
                .getRowByProductId(productId)
                .find('.cart_total .cart_total_price')
                .should('contain.text', priceText.trim());
            });
        });
      });
    });
  });
});
