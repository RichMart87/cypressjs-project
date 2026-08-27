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
const {
  buildRandomUser,
  buildRandomCard,
  toAccountApiPayload,
} = require('../../../utils/dataGenerator');

// Official scenario: Test Case 16 - Place Order: Login before Checkout
describe(
  'UI: Test Case 16 - Place Order: Login before Checkout',
  { tags: ['@ui', '@smoke'] },
  () => {
    const user = buildRandomUser();

    before(() => {
      cy.createUserViaApi(toAccountApiPayload(user));
    });

    it('logs in up front, places an order and deletes the account', () => {
      const card = buildRandomCard();

      homePage.visit();
      homePage.verifyHomePageIsVisible();

      headerNav.goToSignupLogin();
      loginPage.verifyLoginFormIsVisible();
      loginPage.login(user.email, user.password);
      headerNav.verifyLoggedInAs(user.name);

      productsPage.addProductToCartByIndex(0);
      productsPage.viewCartFromModal();
      cartPage.verifyCartPageIsDisplayed();

      cartPage.proceedToCheckout();
      checkoutPage.verifyCheckoutPageIsDisplayed();
      checkoutPage.enterOrderComment('Standard delivery is fine.');
      checkoutPage.placeOrder();

      paymentPage.verifyPaymentPageIsDisplayed();
      paymentPage.fillPaymentDetails(card);
      paymentPage.confirmOrder();
      paymentPage.verifyOrderConfirmed();

      // The order flow itself deletes the account (matching the official
      // steps), so there is no orphaned account left for an after-hook to clean up.
      headerNav.deleteAccount();
      signupPage.verifyAccountDeleted();
    });
  }
);
