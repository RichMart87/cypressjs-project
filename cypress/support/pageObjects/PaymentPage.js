'use strict';

const BasePage = require('./BasePage');

class PaymentPage extends BasePage {
  verifyPaymentPageIsDisplayed() {
    cy.url().should('include', '/payment');
    cy.getByDataQa('name-on-card').should('be.visible');
    return this;
  }

  fillPaymentDetails(card) {
    cy.getByDataQa('name-on-card').type(card.nameOnCard);
    cy.getByDataQa('card-number').type(card.cardNumber);
    cy.getByDataQa('cvc').type(card.cvc);
    cy.getByDataQa('expiry-month').type(card.expiryMonth);
    cy.getByDataQa('expiry-year').type(card.expiryYear);
    return this;
  }

  confirmOrder() {
    cy.getByDataQa('pay-button').click();
    return this;
  }

  verifyOrderConfirmed() {
    cy.url().should('include', '/payment_done');
    cy.contains('order placed!', { matchCase: false }).should('be.visible');
    cy.contains('Congratulations! Your order has been confirmed!', { matchCase: false }).should(
      'be.visible'
    );
    return this;
  }

  getDownloadInvoiceHref() {
    return cy.contains('a', 'Download Invoice').should('have.attr', 'href');
  }

  /**
   * The site serves the invoice as a plain-text file download. Reading the
   * OS-level download from disk is flaky across the headless
   * Chrome/Firefox/Edge matrix used in CI, so instead we assert the link
   * resolves with a real, successful response -- a deterministic way to
   * verify "the invoice download works" without depending on browser
   * download-handling differences.
   */
  verifyInvoiceIsDownloadable() {
    this.getDownloadInvoiceHref().then((href) => {
      cy.request(href).its('status').should('eq', 200);
    });
    return this;
  }

  continueAfterOrder() {
    cy.getByDataQa('continue-button').click();
    return this;
  }
}

module.exports = PaymentPage;
