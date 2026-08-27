'use strict';

/**
 * The top navigation bar is present on every page, so its interactions are
 * modeled once here and composed into other page objects instead of being
 * duplicated across them.
 *
 * Selectors are scoped to `.nav.navbar-nav` (the header's own link list)
 * rather than matching `a[href="..."]` anywhere on the page: several pages
 * -- notably the home page's hero carousel -- repeat the same hrefs in
 * unrelated call-to-action buttons, which would otherwise resolve to
 * multiple elements and fail `cy.click()`.
 */
class HeaderNav {
  navLink(href) {
    return cy.get('.nav.navbar-nav').find(`a[href="${href}"]`);
  }

  goToHome() {
    this.navLink('/').click();
    return this;
  }

  goToProducts() {
    this.navLink('/products').click();
    return this;
  }

  goToCart() {
    this.navLink('/view_cart').click();
    return this;
  }

  goToSignupLogin() {
    this.navLink('/login').click();
    return this;
  }

  goToTestCases() {
    this.navLink('/test_cases').click();
    return this;
  }

  goToApiTesting() {
    this.navLink('/api_list').click();
    return this;
  }

  goToContactUs() {
    this.navLink('/contact_us').click();
    return this;
  }

  logout() {
    this.navLink('/logout').click();
    return this;
  }

  deleteAccount() {
    this.navLink('/delete_account').click();
    return this;
  }

  verifyLoggedInAs(username) {
    cy.get('.nav.navbar-nav')
      .contains('a', 'Logged in as')
      .should('be.visible')
      .and('contain.text', username);
    return this;
  }
}

module.exports = HeaderNav;
