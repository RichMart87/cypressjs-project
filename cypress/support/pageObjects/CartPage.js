'use strict';

const BasePage = require('./BasePage');

class CartPage extends BasePage {
  visit() {
    cy.visit('/view_cart');
    return this;
  }

  verifyCartPageIsDisplayed() {
    cy.url().should('include', '/view_cart');
    cy.get('#cart_info').should('be.visible');
    return this;
  }

  verifyCartIsEmpty() {
    cy.get('#empty_cart').should('be.visible').and('contain.text', 'Cart is empty!');
    return this;
  }

  getRowByProductId(productId) {
    return cy.get(`#product-${productId}`);
  }

  verifyProductInCart(productId, { name, quantity } = {}) {
    // Each assertion re-queries the row rather than reusing one stored
    // chainable: Cypress commands queue sequentially, so a second `.find()`
    // off a saved chainable would run against the *previous* find's result
    // instead of re-selecting the row.
    this.getRowByProductId(productId).should('exist');
    if (name) {
      this.getRowByProductId(productId).find('.cart_description h4 a').should('contain.text', name);
    }
    if (quantity) {
      this.getRowByProductId(productId)
        .find('.cart_quantity button')
        .should('contain.text', String(quantity));
    }
    return this;
  }

  removeProduct(productId) {
    this.getRowByProductId(productId).find('.cart_delete a.cart_quantity_delete').click();
    this.getRowByProductId(productId).should('not.exist');
    return this;
  }

  getRowCount() {
    return cy.get('#cart_info tbody tr');
  }

  proceedToCheckout() {
    cy.get('.btn.btn-default.check_out').first().click();
    return this;
  }

  proceedToCheckoutAsGuest() {
    this.proceedToCheckout();
    cy.get('#checkoutModal').should('be.visible');
    cy.get('#checkoutModal').contains('a', 'Register / Login').click();
    return this;
  }
}

module.exports = CartPage;
