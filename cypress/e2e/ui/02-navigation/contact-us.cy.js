'use strict';

const { homePage, headerNav, contactUsPage } = require('../../../support/pageObjects');
const { buildRandomComment } = require('../../../utils/dataGenerator');

// Official scenario: Test Case 6 - Contact Us Form
describe('UI: Test Case 6 - Contact Us form', { tags: ['@ui', '@regression'] }, () => {
  it('submits the form with an attachment and returns home', () => {
    const comment = buildRandomComment();
    const uploadFixture = 'files/sample-upload.txt';

    homePage.visit();
    homePage.verifyHomePageIsVisible();

    headerNav.goToContactUs();
    contactUsPage.verifyGetInTouchIsVisible();
    contactUsPage.fillForm({
      name: comment.name,
      email: comment.email,
      subject: 'Cypress framework smoke test',
      comment: comment.comment,
    });
    contactUsPage.uploadFile(uploadFixture);
    contactUsPage.submit();
    contactUsPage.verifySuccessMessage();

    contactUsPage.goHome();
    homePage.verifyHomePageIsVisible();
  });
});
