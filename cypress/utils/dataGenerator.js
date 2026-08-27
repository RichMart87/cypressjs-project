'use strict';

const { faker } = require('@faker-js/faker');

/**
 * Builds a fully-populated, unique "Enter Account Information" payload
 * matching automationexercise.com's signup form fields. A fresh random user
 * is generated per call so parallel/repeated CI runs never collide on a
 * shared sandbox account.
 */
function buildRandomUser(overrides = {}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const uniqueSuffix = Date.now().toString(36) + faker.string.alphanumeric(4);

  return {
    name: `${firstName} ${lastName}`,
    email: `qa.${uniqueSuffix}@mailinator.com`,
    password: faker.internet.password({ length: 12, prefix: 'Aa1!' }),
    title: faker.helpers.arrayElement(['Mr', 'Mrs']),
    birthDate: String(faker.number.int({ min: 1, max: 28 })),
    birthMonth: String(faker.number.int({ min: 1, max: 12 })),
    birthYear: String(faker.number.int({ min: 1970, max: 2003 })),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement([
      'United States',
      'Canada',
      'Australia',
      'India',
      'New Zealand',
      'Singapore',
    ]),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number({ style: 'international' }),
    newsletter: true,
    optIn: true,
    ...overrides,
  };
}

function buildRandomCard() {
  return {
    nameOnCard: faker.person.fullName(),
    cardNumber: faker.finance.creditCardNumber('################').slice(0, 16),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0'),
    expiryYear: String(faker.number.int({ min: 2026, max: 2032 })),
  };
}

function buildRandomComment() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    comment: faker.lorem.sentences(2),
  };
}

/**
 * The createAccount/updateAccount APIs expect snake_case keys that don't
 * match the camelCase fields used by the UI signup page object (which
 * mirror the DOM element ids). This adapts one user object to the API's
 * wire format so both UI and API suites can share a single data builder.
 */
function toAccountApiPayload(user) {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    birth_date: user.birthDate,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    zipcode: user.zipcode,
    state: user.state,
    city: user.city,
    mobile_number: user.mobileNumber,
  };
}

module.exports = {
  buildRandomUser,
  buildRandomCard,
  buildRandomComment,
  toAccountApiPayload,
};
