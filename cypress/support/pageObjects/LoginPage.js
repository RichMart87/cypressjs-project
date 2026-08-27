'use strict';

const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  visit() {
    cy.visit('/login');
    return this;
  }

  verifyLoginFormIsVisible() {
    cy.contains('h2', 'Login to your account').should('be.visible');
    return this;
  }

  verifySignupFormIsVisible() {
    cy.contains('h2', 'New User Signup!').should('be.visible');
    return this;
  }

  login(email, password) {
    cy.getByDataQa('login-email').type(email);
    cy.getByDataQa('login-password').type(password, { log: false });
    cy.getByDataQa('login-button').click();
    return this;
  }

  verifyLoginErrorIsVisible() {
    cy.contains('Your email or password is incorrect!').should('be.visible');
    return this;
  }

  signup(name, email) {
    cy.getByDataQa('signup-name').type(name);
    cy.getByDataQa('signup-email').type(email);
    cy.getByDataQa('signup-button').click();
    return this;
  }

  verifySignupErrorIsVisible() {
    cy.contains('Email Address already exist!').should('be.visible');
    return this;
  }
}

module.exports = LoginPage;
