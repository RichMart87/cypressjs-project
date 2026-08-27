'use strict';

const {
  homePage,
  headerNav,
  productsPage,
  cartPage,
  loginPage,
} = require('../../../support/pageObjects');
const { buildRandomUser, toAccountApiPayload } = require('../../../utils/dataGenerator');
const searchTerms = require('../../../fixtures/searchTerms.json');

// Official scenario: Test Case 20 - Search Products and Verify Cart After Login
describe(
  'UI: Test Case 20 - Search Products and Verify Cart After Login',
  { tags: ['@ui', '@regression'] },
  () => {
    const user = buildRandomUser();

    before(() => {
      cy.createUserViaApi(toAccountApiPayload(user));
    });

    after(() => {
      cy.deleteUserViaApi(user.email, user.password);
    });

    it('keeps searched products in the cart across login', () => {
      homePage.visit();
      headerNav.goToProducts();
      productsPage.verifyAllProductsHeading();

      productsPage.searchProduct(searchTerms.valid);
      productsPage.verifySearchedProductsHeading();

      productsPage.getProductIdAtIndex(0).then((productId) => {
        productsPage.addProductToCartByIndex(0);
        productsPage.viewCartFromModal();

        cartPage.verifyCartPageIsDisplayed();
        cartPage.getRowByProductId(productId).should('exist');

        headerNav.goToSignupLogin();
        loginPage.verifyLoginFormIsVisible();
        loginPage.login(user.email, user.password);
        headerNav.verifyLoggedInAs(user.name);

        headerNav.goToCart();
        cartPage.verifyCartPageIsDisplayed();
        cartPage.getRowByProductId(productId).should('exist');
      });
    });
  }
);
