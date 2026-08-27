'use strict';

const {
  homePage,
  headerNav,
  productsPage,
  cartPage,
  loginPage,
  signupPage,
  checkoutPage,
  paymentPage,
} = require('../../../support/pageObjects');
const { buildRandomUser, buildRandomCard } = require('../../../utils/dataGenerator');

// Official scenario: Test Case 15 - Place Order: Register before Checkout
describe(
  'UI: Test Case 15 - Place Order: Register before Checkout',
  { tags: ['@ui', '@smoke'] },
  () => {
    it('registers up front, places an order and deletes the account', () => {
      const user = buildRandomUser();
      const card = buildRandomCard();

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
      checkoutPage.enterOrderComment('Please ring the bell on arrival.');
      checkoutPage.placeOrder();

      paymentPage.verifyPaymentPageIsDisplayed();
      paymentPage.fillPaymentDetails(card);
      paymentPage.confirmOrder();
      paymentPage.verifyOrderConfirmed();

      headerNav.deleteAccount();
      signupPage.verifyAccountDeleted();
    });
  }
);
