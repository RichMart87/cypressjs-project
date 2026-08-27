'use strict';

const {
  homePage,
  headerNav,
  productsPage,
  productDetailPage,
} = require('../../../support/pageObjects');

// Official scenario: Test Case 8 - Verify All Products and product detail page
describe(
  'UI: Test Case 8 - All Products and product detail page',
  { tags: ['@ui', '@smoke'] },
  () => {
    it('opens the first product and verifies its detail page', () => {
      homePage.visit();
      homePage.verifyHomePageIsVisible();

      headerNav.goToProducts();
      productsPage.verifyAllProductsHeading();
      productsPage.getProductCards().should('have.length.greaterThan', 0);

      productsPage.viewProductByIndex(0);
      cy.url().should('include', '/product_details/');
      productDetailPage.verifyProductDetailIsVisible();
    });
  }
);
