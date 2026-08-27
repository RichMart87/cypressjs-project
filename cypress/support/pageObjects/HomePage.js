'use strict';

const BasePage = require('./BasePage');

class HomePage extends BasePage {
  visit() {
    cy.visit('/');
    return this;
  }

  verifyTaglineIsVisible() {
    cy.contains('h2', 'Full-Fledged practice website for Automation Engineers').should(
      'be.visible'
    );
    return this;
  }

  verifySubscriptionHeadingIsVisible() {
    cy.contains('h2', 'Subscription').should('be.visible');
    return this;
  }

  verifyRecommendedItemsVisible() {
    cy.contains('h2', 'recommended items', { matchCase: false }).scrollIntoView();
    cy.contains('h2', 'recommended items', { matchCase: false }).should('be.visible');
    return this;
  }

  addFirstRecommendedItemToCart() {
    cy.get('#recommended-item-carousel .product-image-wrapper')
      .first()
      .find('a.add-to-cart')
      .first()
      .click({ force: true });
    return this;
  }

  viewCartFromModal() {
    cy.get('#cartModal').should('be.visible').contains('a', 'View Cart').click();
    return this;
  }
}

module.exports = HomePage;
