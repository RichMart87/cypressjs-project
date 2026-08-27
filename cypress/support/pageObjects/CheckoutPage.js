'use strict';

const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  verifyCheckoutPageIsDisplayed() {
    cy.url().should('include', '/checkout');
    cy.contains('Address Details').should('be.visible');
    cy.contains('Review Your Order').should('be.visible');
    return this;
  }

  verifyAddressMatchesUser(user) {
    [cy.get('#address_delivery'), cy.get('#address_invoice')].forEach((section) => {
      section.should('contain.text', `${user.firstName} ${user.lastName}`);
      section.should('contain.text', user.address1);
      section.should('contain.text', user.city);
      section.should('contain.text', user.state);
      section.should('contain.text', user.zipcode);
      section.should('contain.text', user.country);
    });
    return this;
  }

  verifyOrderReviewContainsProduct(productName) {
    cy.get('#cart_info').should('contain.text', productName);
    return this;
  }

  enterOrderComment(comment) {
    cy.get('textarea[name="message"]').type(comment);
    return this;
  }

  placeOrder() {
    cy.contains('a', 'Place Order').click();
    return this;
  }
}

module.exports = CheckoutPage;
