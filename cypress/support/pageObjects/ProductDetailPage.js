'use strict';

const BasePage = require('./BasePage');

class ProductDetailPage extends BasePage {
  verifyProductDetailIsVisible() {
    cy.get('.product-information h2').should('be.visible');
    cy.get('.product-information').contains('Category:').should('be.visible');
    cy.get('.product-information').contains('Availability:').should('be.visible');
    cy.get('.product-information').contains('Condition:').should('be.visible');
    cy.get('.product-information').contains('Brand:').should('be.visible');
    return this;
  }

  getProductName() {
    return cy.get('.product-information h2').invoke('text');
  }

  setQuantity(quantity) {
    cy.get('#quantity').clear();
    cy.get('#quantity').type(String(quantity));
    return this;
  }

  addToCart() {
    cy.get('.product-information .btn.cart').click();
    return this;
  }

  viewCartFromModal() {
    cy.get('#cartModal').should('be.visible').contains('a', 'View Cart').click();
    return this;
  }

  submitReview({ name, email, comment }) {
    cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#review').type(comment);
    cy.get('#button-review').click();
    return this;
  }

  verifyReviewSubmitted() {
    cy.get('#review-section')
      .should('be.visible')
      .and('contain.text', 'Thank you for your review.');
    return this;
  }
}

module.exports = ProductDetailPage;
