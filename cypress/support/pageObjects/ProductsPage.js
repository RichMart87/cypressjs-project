'use strict';

const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  visit() {
    cy.visit('/products');
    return this;
  }

  verifyAllProductsHeading() {
    cy.contains('h2.title', 'All Products').should('be.visible');
    return this;
  }

  verifySearchedProductsHeading() {
    cy.contains('h2.title', 'Searched Products').should('be.visible');
    return this;
  }

  searchProduct(productName) {
    cy.get('#search_product').clear();
    cy.get('#search_product').type(productName);
    cy.get('#submit_search').click();
    return this;
  }

  getProductCards() {
    return cy.get('.product-image-wrapper');
  }

  addProductToCartById(productId) {
    cy.get(`a.add-to-cart[data-product-id="${productId}"]`).first().click({ force: true });
    return this;
  }

  addProductToCartByIndex(index) {
    this.getProductCards().eq(index).find('a.add-to-cart').first().click({ force: true });
    return this;
  }

  continueShopping() {
    cy.get('#cartModal').should('be.visible');
    cy.get('#cartModal .close-modal').click();
    cy.get('#cartModal').should('not.be.visible');
    return this;
  }

  viewCartFromModal() {
    cy.get('#cartModal').should('be.visible').contains('a', 'View Cart').click();
    return this;
  }

  viewProductByIndex(index) {
    this.getProductCards().eq(index).find('.choose a').click({ force: true });
    return this;
  }

  viewProductById(productId) {
    cy.visit(`/product_details/${productId}`);
    return this;
  }

  getProductNameAtIndex(index) {
    return this.getProductCards().eq(index).find('.productinfo p').invoke('text');
  }

  getProductIdAtIndex(index) {
    return this.getProductCards()
      .eq(index)
      .find('a.add-to-cart')
      .first()
      .invoke('attr', 'data-product-id');
  }

  selectCategory(category, subCategoryLinkText) {
    cy.contains('.category-products .panel-title a', category).click();
    cy.get(`#${category} .panel-body`).contains('a', subCategoryLinkText).click();
    return this;
  }

  selectBrand(brandName) {
    cy.get('.brands_products').contains('a', brandName).click();
    return this;
  }

  verifyCategoryOrBrandHeading(expectedText) {
    cy.contains('h2.title', expectedText).should('be.visible');
    return this;
  }
}

module.exports = ProductsPage;
