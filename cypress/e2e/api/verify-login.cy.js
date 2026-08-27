'use strict';

const { apiEndpoints, apiResponseCode, apiMessages } = require('../../utils/constants');
const { buildRandomUser, toAccountApiPayload } = require('../../utils/dataGenerator');
const invalidUser = require('../../fixtures/invalidUser.json');

describe('API: Verify Login', { tags: '@api' }, () => {
  const user = buildRandomUser();

  before(() => {
    cy.createUserViaApi(toAccountApiPayload(user)).then((response) => {
      expect(response.body.responseCode).to.eq(apiResponseCode.CREATED);
    });
  });

  after(() => {
    cy.deleteUserViaApi(user.email, user.password);
  });

  it(
    'API 7: POST /verifyLogin with valid details confirms the user exists',
    { tags: '@smoke' },
    () => {
      cy.apiRequest({
        method: 'POST',
        url: apiEndpoints.verifyLogin,
        form: true,
        body: { email: user.email, password: user.password },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
        expect(response.body.message).to.eq(apiMessages.USER_EXISTS);
      });
    }
  );

  it(
    'API 8: POST /verifyLogin without the email param returns a 400 bad request',
    { tags: '@regression' },
    () => {
      cy.apiRequest({
        method: 'POST',
        url: apiEndpoints.verifyLogin,
        form: true,
        body: { password: user.password },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.responseCode).to.eq(apiResponseCode.BAD_REQUEST);
        expect(response.body.message).to.eq(apiMessages.EMAIL_PARAM_MISSING);
      });
    }
  );

  it('API 9: DELETE /verifyLogin is not a supported method', { tags: '@regression' }, () => {
    cy.apiRequest({
      method: 'DELETE',
      url: apiEndpoints.verifyLogin,
      form: true,
      body: { email: user.email, password: user.password },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.METHOD_NOT_ALLOWED);
      expect(response.body.message).to.eq(apiMessages.METHOD_NOT_SUPPORTED);
    });
  });

  it(
    'API 10: POST /verifyLogin with invalid details returns 404 user not found',
    { tags: '@regression' },
    () => {
      cy.apiRequest({
        method: 'POST',
        url: apiEndpoints.verifyLogin,
        form: true,
        body: { email: invalidUser.email, password: invalidUser.password },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.responseCode).to.eq(apiResponseCode.NOT_FOUND);
        expect(response.body.message).to.eq(apiMessages.USER_NOT_FOUND);
      });
    }
  );
});
