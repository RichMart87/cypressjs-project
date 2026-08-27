'use strict';

const { apiEndpoints, apiResponseCode, apiMessages } = require('../../utils/constants');

describe('API: Brands List', { tags: '@api' }, () => {
  it('API 3: GET /brandsList returns 200 with a populated brand list', { tags: '@smoke' }, () => {
    cy.apiRequest({ method: 'GET', url: apiEndpoints.brandsList }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
      expect(response.body.brands).to.be.an('array').and.have.length.greaterThan(0);
      expect(response.body.brands[0]).to.include.keys(['id', 'brand']);
    });
  });

  it('API 4: PUT /brandsList is not a supported method', { tags: '@regression' }, () => {
    cy.apiRequest({ method: 'PUT', url: apiEndpoints.brandsList }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.METHOD_NOT_ALLOWED);
      expect(response.body.message).to.eq(apiMessages.METHOD_NOT_SUPPORTED);
    });
  });
});
