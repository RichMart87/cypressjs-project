'use strict';

/**
 * Custom Cypress commands shared across the whole suite.
 * Page-specific interactions live in cypress/support/pageObjects/*;
 * this file is reserved for cross-cutting, reusable primitives.
 */

// ---------------------------------------------------------------------------
// Selector helpers
// ---------------------------------------------------------------------------

/**
 * automationexercise.com exposes stable `data-qa` attributes on most
 * interactive elements (e.g. data-qa="login-button"). Preferring these over
 * CSS classes/ids keeps tests resilient to styling/markup churn.
 */
Cypress.Commands.add('getByDataQa', (value) => {
  return cy.get(`[data-qa="${value}"]`);
});

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

Cypress.Commands.add('visitHome', () => {
  cy.visit('/');
  cy.getByDataQa('search_products'); // implicit wait for hydration
});

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around cy.request that defaults to the environment's API base
 * URL and never auto-fails on non-2xx, so tests can assert on error
 * responses (400/404/405) without wrapping every call in a try/catch.
 *
 * automationexercise.com's API answers every call with a JSON payload but
 * mislabels it as `Content-Type: text/html`, so Cypress's automatic JSON
 * parsing never kicks in and `response.body` arrives as a raw string. This
 * normalizes it back into an object so specs can assert on
 * `response.body.responseCode` etc. directly, the way they would against a
 * correctly-labeled API.
 */
Cypress.Commands.add('apiRequest', (options) => {
  const apiUrl = Cypress.env('apiUrl');
  const { url, ...rest } = options;

  return cy
    .request({
      failOnStatusCode: false,
      url: `${apiUrl}${url}`,
      ...rest,
    })
    .then((response) => {
      if (typeof response.body === 'string') {
        try {
          response.body = JSON.parse(response.body);
        } catch {
          // Not JSON -- leave the raw string body as-is.
        }
      }
      return response;
    });
});

/**
 * Registers a user via the public API. Used for UI-test setup so scenarios
 * that require "an existing account" don't depend on hard-coded fixture
 * accounts that could already exist/not exist on the shared sandbox site.
 */
Cypress.Commands.add('createUserViaApi', (user) => {
  return cy.apiRequest({
    method: 'POST',
    url: '/createAccount',
    form: true,
    body: user,
  });
});

Cypress.Commands.add('deleteUserViaApi', (email, password) => {
  return cy.apiRequest({
    method: 'DELETE',
    url: '/deleteAccount',
    form: true,
    body: { email, password },
  });
});

// ---------------------------------------------------------------------------
// UI auth helpers
// ---------------------------------------------------------------------------

/**
 * Logs a user in through the real UI and caches the resulting session
 * (cookies/localStorage) keyed by email, so repeated logins across specs in
 * the same run only pay the UI cost once. cy.session validates the cached
 * session is still active before reusing it.
 */
Cypress.Commands.add('loginViaUi', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/login');
      cy.getByDataQa('login-email').type(email);
      cy.getByDataQa('login-password').type(password, { log: false });
      cy.getByDataQa('login-button').click();
      cy.contains('Logged in as').should('be.visible');
    },
    {
      validate() {
        cy.getCookie('userId').should('exist');
      },
      cacheAcrossSpecs: true,
    }
  );
  cy.visit('/');
});
