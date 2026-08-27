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

// Official scenario: Test Case 24 - Download Invoice after purchase order
describe(
  'UI: Test Case 24 - Download Invoice after purchase order',
  { tags: ['@ui', '@regression'] },
  () => {
    it('places an order and downloads the invoice', () => {
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
      checkoutPage.enterOrderComment('Leave with the concierge.');
      checkoutPage.placeOrder();

      paymentPage.verifyPaymentPageIsDisplayed();
      paymentPage.fillPaymentDetails(card);
      paymentPage.confirmOrder();
      paymentPage.verifyOrderConfirmed();

      paymentPage.verifyInvoiceIsDownloadable();
      paymentPage.continueAfterOrder();

      headerNav.deleteAccount();
      signupPage.verifyAccountDeleted();
    });
  }
);
