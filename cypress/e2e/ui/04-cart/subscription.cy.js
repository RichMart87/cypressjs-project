'use strict';

const { homePage, headerNav, cartPage } = require('../../../support/pageObjects');
const { faker } = require('@faker-js/faker');

// Official scenario: Test Case 10 - Verify Subscription in home page
describe('UI: Test Case 10 - Subscription on home page', { tags: ['@ui', '@regression'] }, () => {
  it('subscribes successfully from the footer', () => {
    homePage.visit();
    homePage.verifyHomePageIsVisible();
    homePage.subscribeWithEmail(faker.internet.email());
  });
});

// Official scenario: Test Case 11 - Verify Subscription in Cart page
describe('UI: Test Case 11 - Subscription on cart page', { tags: ['@ui', '@regression'] }, () => {
  it('subscribes successfully from the footer on the cart page', () => {
    homePage.visit();
    headerNav.goToCart();
    cartPage.verifyCartPageIsDisplayed();
    cartPage.subscribeWithEmail(faker.internet.email());
  });
});
