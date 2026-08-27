'use strict';

const { apiEndpoints, apiResponseCode, apiMessages } = require('../../utils/constants');
const searchTerms = require('../../fixtures/searchTerms.json');

describe('API: Search Product', { tags: '@api' }, () => {
  it(
    'API 5: POST /searchProduct with a search_product term returns matching products',
    { tags: '@smoke' },
    () => {
      cy.apiRequest({
        method: 'POST',
        url: apiEndpoints.searchProduct,
        form: true,
        body: { search_product: searchTerms.valid },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
        expect(response.body.products).to.be.an('array').and.have.length.greaterThan(0);
      });
    }
  );

  it(
    'API 6: POST /searchProduct without search_product returns a 400 bad request',
    { tags: '@regression' },
    () => {
      cy.apiRequest({
        method: 'POST',
        url: apiEndpoints.searchProduct,
        form: true,
        body: {},
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.responseCode).to.eq(apiResponseCode.BAD_REQUEST);
        expect(response.body.message).to.eq(apiMessages.SEARCH_PARAM_MISSING);
      });
    }
  );
});
