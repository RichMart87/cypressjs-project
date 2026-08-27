'use strict';

const { apiEndpoints, apiResponseCode, apiMessages } = require('../../utils/constants');
const { buildRandomUser, toAccountApiPayload } = require('../../utils/dataGenerator');

/**
 * APIs 11-14 are naturally sequential (create -> read -> update -> delete
 * -> confirm gone) around a single account, so they're modeled as one
 * ordered flow rather than four isolated specs sharing brittle setup/teardown.
 */
describe('API: Account Lifecycle', { tags: '@api' }, () => {
  const user = buildRandomUser();
  const updatedCompany = 'Updated Co. via API';

  it('API 11: POST /createAccount creates a new user', { tags: '@smoke' }, () => {
    cy.createUserViaApi(toAccountApiPayload(user)).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.CREATED);
      expect(response.body.message).to.eq(apiMessages.USER_CREATED);
    });
  });

  it('API 14: GET /getUserDetailByEmail returns the created user', { tags: '@smoke' }, () => {
    cy.apiRequest({
      method: 'GET',
      url: `${apiEndpoints.getUserDetailByEmail}?email=${encodeURIComponent(user.email)}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
      expect(response.body.user.email).to.eq(user.email);
      expect(response.body.user.first_name).to.eq(user.firstName);
      expect(response.body.user.last_name).to.eq(user.lastName);
    });
  });

  it('API 13: PUT /updateAccount updates the account details', { tags: '@regression' }, () => {
    cy.apiRequest({
      method: 'PUT',
      url: apiEndpoints.updateAccount,
      form: true,
      body: { ...toAccountApiPayload(user), company: updatedCompany },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
      expect(response.body.message).to.eq(apiMessages.USER_UPDATED);
    });
  });

  it('reflects the updated company name on a follow-up lookup', { tags: '@regression' }, () => {
    cy.apiRequest({
      method: 'GET',
      url: `${apiEndpoints.getUserDetailByEmail}?email=${encodeURIComponent(user.email)}`,
    }).then((response) => {
      expect(response.body.user.company).to.eq(updatedCompany);
    });
  });

  it('API 12: DELETE /deleteAccount removes the account', { tags: '@smoke' }, () => {
    cy.deleteUserViaApi(user.email, user.password).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.responseCode).to.eq(apiResponseCode.SUCCESS);
      expect(response.body.message).to.eq(apiMessages.ACCOUNT_DELETED);
    });
  });

  it('GET /getUserDetailByEmail no longer finds the deleted user', { tags: '@regression' }, () => {
    cy.apiRequest({
      method: 'GET',
      url: `${apiEndpoints.getUserDetailByEmail}?email=${encodeURIComponent(user.email)}`,
    }).then((response) => {
      expect(response.body.responseCode).to.eq(apiResponseCode.NOT_FOUND);
    });
  });
});
