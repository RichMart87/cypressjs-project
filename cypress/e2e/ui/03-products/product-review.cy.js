'use strict';

const {
  homePage,
  headerNav,
  productsPage,
  productDetailPage,
} = require('../../../support/pageObjects');
const { buildRandomComment } = require('../../../utils/dataGenerator');

// Official scenario: Test Case 21 - Add review on product
describe('UI: Test Case 21 - Add review on product', { tags: ['@ui', '@regression'] }, () => {
  it('submits a review and sees the thank-you confirmation', () => {
    const review = buildRandomComment();

    homePage.visit();
    headerNav.goToProducts();
    productsPage.verifyAllProductsHeading();

    productsPage.viewProductByIndex(0);
    cy.contains('a', 'Write Your Review').should('be.visible').click();

    productDetailPage.submitReview(review);
    productDetailPage.verifyReviewSubmitted();
  });
});
