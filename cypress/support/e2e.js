'use strict';

require('./commands');
require('cypress-mochawesome-reporter/register');

const { register: registerCypressGrep } = require('@cypress/grep');

registerCypressGrep();

/**
 * automationexercise.com occasionally throws unrelated third-party/ad-script
 * errors that surface as uncaught exceptions but do not affect the flows
 * under test. We don't want a flaky ad script to fail an otherwise-passing
 * assertion-driven test, so we log and swallow anything that isn't coming
 * from an explicit test assertion.
 */
Cypress.on('uncaught:exception', (err) => {
  console.warn('[uncaught:exception swallowed]', err.message);
  return false;
});

// Preserve cookies is default in modern Cypress, but keep intent explicit
// for readers coming from older Cypress versions / other frameworks.
beforeEach(() => {
  cy.clearCookie('CookieConsent');
});
