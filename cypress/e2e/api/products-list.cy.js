'use strict';

const { apiEndpoints, apiResponseCode, apiMessages } = require('../../utils/constants');

describe('API: Products List', { tags: '@api' }, () => {
  it(
    'API 1: GET /productsList returns 200 with a populated product list',
    { tags: '@smoke' },
    () => {
      cy.apiRequest({ method: 'GET', url: apiEndpoints.productsList }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
        expect(response.body.products).to.be.an('array').and.have.length.greaterThan(0);

        const [firstProduct] = response.body.products;
        expect(firstProduct).to.include.keys(['id', 'name', 'price', 'brand', 'category']);
      });
    }
  );

  it('API 2: POST /productsList is not a supported method', { tags: '@regression' }, () => {
    cy.apiRequest({ method: 'POST', url: apiEndpoints.productsList }).then((response) => {
      expect(response.status).to.eq(200); // API always answers 200 at the transport level
      expect(response.body.responseCode).to.eq(apiResponseCode.METHOD_NOT_ALLOWED);
      expect(response.body.message).to.eq(apiMessages.METHOD_NOT_SUPPORTED);
    });
  });
});
