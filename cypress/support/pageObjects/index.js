'use strict';

/**
 * Single import surface for every page object, so specs can do:
 *   const { homePage, loginPage, cartPage } = require('../../support/pageObjects');
 * instead of wiring up individual requires + `new` per spec.
 */
const HomePage = require('./HomePage');
const HeaderNav = require('./HeaderNav');
const LoginPage = require('./LoginPage');
const SignupPage = require('./SignupPage');
const ProductsPage = require('./ProductsPage');
const ProductDetailPage = require('./ProductDetailPage');
const CartPage = require('./CartPage');
const CheckoutPage = require('./CheckoutPage');
const PaymentPage = require('./PaymentPage');
const ContactUsPage = require('./ContactUsPage');

module.exports = {
  homePage: new HomePage(),
  headerNav: new HeaderNav(),
  loginPage: new LoginPage(),
  signupPage: new SignupPage(),
  productsPage: new ProductsPage(),
  productDetailPage: new ProductDetailPage(),
  cartPage: new CartPage(),
  checkoutPage: new CheckoutPage(),
  paymentPage: new PaymentPage(),
  contactUsPage: new ContactUsPage(),
};
