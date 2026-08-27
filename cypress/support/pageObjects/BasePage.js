'use strict';

/**
 * Common, page-agnostic interactions shared by every page object.
 * Concrete page objects extend this class rather than duplicating helpers.
 */
class BasePage {
  scrollToBottom() {
    cy.scrollTo('bottom', { ensureScrollable: false });
    return this;
  }

  scrollToTop() {
    cy.scrollTo('top', { ensureScrollable: false });
    return this;
  }

  clickScrollUpArrow() {
    cy.get('#scrollUp').click({ force: true });
    return this;
  }

  verifyHomePageIsVisible() {
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.get('#slider').should('be.visible');
    return this;
  }

  subscribeWithEmail(email) {
    this.scrollToBottom();
    cy.get('#susbscribe_email').should('be.visible').type(email);
    cy.get('#subscribe').click();
    cy.get('#success-subscribe')
      .should('be.visible')
      .and('contain.text', 'You have been successfully subscribed!');
    return this;
  }
}

module.exports = BasePage;
