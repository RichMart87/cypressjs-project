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

// Official scenario: Test Case 14 - Place Order: Register while Checkout
describe(
  'UI: Test Case 14 - Place Order: Register while Checkout',
  { tags: ['@ui', '@smoke'] },
  () => {
    it('registers mid-checkout, places an order and deletes the account', () => {
      const user = buildRandomUser();
      const card = buildRandomCard();

      homePage.visit();
      homePage.verifyHomePageIsVisible();

      productsPage.addProductToCartByIndex(0);
      productsPage.viewCartFromModal();
      cartPage.verifyCartPageIsDisplayed();

      cartPage.proceedToCheckoutAsGuest();
      loginPage.verifySignupFormIsVisible();
      loginPage.signup(user.name, user.email);

      signupPage.verifyAccountInfoFormIsVisible();
      signupPage.registerNewUser(user);
      headerNav.verifyLoggedInAs(user.name);

      headerNav.goToCart();
      cartPage.proceedToCheckout();

      checkoutPage.verifyCheckoutPageIsDisplayed();
      checkoutPage.verifyAddressMatchesUser(user);
      checkoutPage.enterOrderComment('Please leave the package at the front door.');
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
