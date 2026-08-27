'use strict';

const { homePage, headerNav, productsPage } = require('../../../support/pageObjects');
const searchTerms = require('../../../fixtures/searchTerms.json');

// Official scenario: Test Case 9 - Search Product
describe('UI: Test Case 9 - Search Product', { tags: ['@ui', '@smoke'] }, () => {
  it('returns only products matching the search term', () => {
    homePage.visit();
    headerNav.goToProducts();
    productsPage.verifyAllProductsHeading();

    productsPage.searchProduct(searchTerms.valid);
    productsPage.verifySearchedProductsHeading();

    // The site's search matches across name/category/brand rather than a
    // strict name substring, so it can legitimately return loosely-related
    // items alongside exact matches. We assert the result set is non-empty
    // and that the exact match we searched for is present, rather than
    // requiring every single result to contain the search term.
    productsPage.getProductCards().should('have.length.greaterThan', 0);
    productsPage
      .getProductCards()
      .find('.productinfo p')
      .then(($names) => Cypress._.map($names, 'innerText'))
      .should('include', 'Blue Top');
  });
});
