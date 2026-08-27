'use strict';

const { homePage, headerNav, productsPage } = require('../../../support/pageObjects');

// Official scenario: Test Case 19 - View & Cart Brand Products
describe('UI: Test Case 19 - View Brand Products', { tags: ['@ui', '@regression'] }, () => {
  it('navigates into a brand then across to a different brand', () => {
    homePage.visit();
    headerNav.goToProducts();
    cy.get('.brands_products').should('be.visible');

    productsPage.selectBrand('Polo');
    cy.get('h2.title')
      .invoke('text')
      .should('match', /brand\s*-\s*polo products/i);
    productsPage.getProductCards().should('have.length.greaterThan', 0);

    cy.get('.brands_products').contains('a', 'H&M').click();
    cy.get('h2.title')
      .invoke('text')
      .should('match', /brand\s*-\s*h&m products/i);
    productsPage.getProductCards().should('have.length.greaterThan', 0);
  });
});
