'use strict';

const BasePage = require('./BasePage');

class ContactUsPage extends BasePage {
  visit() {
    cy.visit('/contact_us');
    return this;
  }

  /**
   * The page fires a native window.confirm("Press OK to proceed!") on
   * submit. Stubbing on cy.visit's onBeforeLoad only works when we navigate
   * via cy.visit directly; since specs often arrive here by clicking the
   * header nav link instead, the stub is (re)applied against the current
   * window right before the click that would trigger it.
   */
  stubConfirmDialog() {
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });
    return this;
  }

  verifyGetInTouchIsVisible() {
    cy.contains('h2', 'Get In Touch').should('be.visible');
    return this;
  }

  fillForm({ name, email, subject, comment }) {
    cy.getByDataQa('name').type(name);
    cy.getByDataQa('email').type(email);
    cy.getByDataQa('subject').type(subject);
    cy.getByDataQa('message').type(comment);
    return this;
  }

  /**
   * `cy.selectFile` resolves paths relative to the project root (unlike
   * `cy.fixture`, which is relative to cypress/fixtures), so the fixture
   * folder prefix is added here to keep call sites fixture-relative.
   */
  uploadFile(fixtureRelativePath) {
    cy.get('input[name="upload_file"]').selectFile(`cypress/fixtures/${fixtureRelativePath}`);
    return this;
  }

  submit() {
    this.stubConfirmDialog();
    cy.getByDataQa('submit-button').click();
    return this;
  }

  verifySuccessMessage() {
    cy.get('.status.alert-success')
      .should('be.visible')
      .and('contain.text', 'Success! Your details have been submitted successfully.');
    return this;
  }

  goHome() {
    cy.contains('a.btn.btn-success', 'Home').click();
    return this;
  }
}

module.exports = ContactUsPage;
