'use strict';

const BasePage = require('./BasePage');

/**
 * The "ENTER ACCOUNT INFORMATION" form that is rendered at /signup after
 * submitting the initial name+email signup step, plus the account
 * created/deleted confirmation screens.
 */
class SignupPage extends BasePage {
  verifyAccountInfoFormIsVisible() {
    cy.contains('h2', 'Enter Account Information').should('be.visible');
    return this;
  }

  fillAccountInformation(user) {
    cy.get(user.title === 'Mrs' ? '#id_gender2' : '#id_gender1').check({ force: true });
    cy.get('#password').type(user.password, { log: false });
    cy.get('#days').select(user.birthDate);
    cy.get('#months').select(user.birthMonth);
    cy.get('#years').select(user.birthYear);

    if (user.newsletter) {
      cy.get('#newsletter').check({ force: true });
    }
    if (user.optIn) {
      cy.get('#optin').check({ force: true });
    }

    cy.get('#first_name').type(user.firstName);
    cy.get('#last_name').type(user.lastName);
    cy.get('#company').type(user.company);
    cy.get('#address1').type(user.address1);
    cy.get('#address2').type(user.address2);
    cy.get('#country').select(user.country);
    cy.get('#state').type(user.state);
    cy.get('#city').type(user.city);
    cy.get('#zipcode').type(user.zipcode);
    cy.get('#mobile_number').type(user.mobileNumber);
    return this;
  }

  submit() {
    cy.getByDataQa('create-account').click();
    return this;
  }

  verifyAccountCreated() {
    cy.getByDataQa('account-created').should('be.visible').and('contain.text', 'Account Created!');
    return this;
  }

  continueToAccount() {
    cy.getByDataQa('continue-button').click();
    return this;
  }

  verifyAccountDeleted() {
    cy.getByDataQa('account-deleted').should('be.visible').and('contain.text', 'Account Deleted!');
    return this;
  }

  registerNewUser(user) {
    this.fillAccountInformation(user);
    this.submit();
    this.verifyAccountCreated();
    this.continueToAccount();
    return this;
  }
}

module.exports = SignupPage;
