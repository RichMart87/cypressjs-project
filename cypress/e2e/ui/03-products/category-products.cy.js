'use strict';

const { homePage, productsPage } = require('../../../support/pageObjects');

// Official scenario: Test Case 18 - View Category Products
describe('UI: Test Case 18 - View Category Products', { tags: ['@ui', '@regression'] }, () => {
  it('navigates into a category then across to a different one', () => {
    homePage.visit();
    homePage.verifyHomePageIsVisible();
    cy.get('.category-products').should('be.visible');

    productsPage.selectCategory('Women', 'Tops');
    cy.get('h2.title')
      .invoke('text')
      .should('match', /women\s*-\s*tops products/i);

    productsPage.selectCategory('Men', 'Tshirts');
    cy.get('h2.title')
      .invoke('text')
      .should('match', /men\s*-\s*tshirts products/i);
  });
});
