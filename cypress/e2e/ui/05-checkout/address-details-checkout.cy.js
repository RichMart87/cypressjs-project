'use strict';

const {
  homePage,
  headerNav,
  productsPage,
  cartPage,
  loginPage,
  signupPage,
  checkoutPage,
} = require('../../../support/pageObjects');
const { buildRandomUser } = require('../../../utils/dataGenerator');

// Official scenario: Test Case 23 - Verify address details in checkout page
describe(
  'UI: Test Case 23 - Verify address details in checkout page',
  { tags: ['@ui', '@regression'] },
  () => {
    it('shows the registration address as both delivery and billing address', () => {
      const user = buildRandomUser();

      homePage.visit();
      homePage.verifyHomePageIsVisible();

      headerNav.goToSignupLogin();
      loginPage.verifySignupFormIsVisible();
      loginPage.signup(user.name, user.email);

      signupPage.verifyAccountInfoFormIsVisible();
      signupPage.registerNewUser(user);
      headerNav.verifyLoggedInAs(user.name);

      productsPage.addProductToCartByIndex(0);
      productsPage.viewCartFromModal();
      cartPage.verifyCartPageIsDisplayed();

      cartPage.proceedToCheckout();
      checkoutPage.verifyCheckoutPageIsDisplayed();
      checkoutPage.verifyAddressMatchesUser(user);

      headerNav.deleteAccount();
      signupPage.verifyAccountDeleted();
    });
  }
);
