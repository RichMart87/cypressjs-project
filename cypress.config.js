'use strict';

const { defineConfig } = require('cypress');
const cypressMochawesomeReporterPlugin = require('cypress-mochawesome-reporter/plugin');

/**
 * Per-environment base/API URLs. automationexercise.com only exposes a single
 * public environment, but the framework is wired for multi-env (qa/staging/prod)
 * the way it would be for an internal app under test.
 */
const environments = {
  prod: {
    baseUrl: 'https://automationexercise.com',
    apiUrl: 'https://automationexercise.com/api',
  },
  qa: {
    baseUrl: 'https://automationexercise.com',
    apiUrl: 'https://automationexercise.com/api',
  },
};

module.exports = defineConfig({
  trashAssetsBeforeRuns: true,
  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 15000,
  pageLoadTimeout: 60000,
  viewportWidth: 1366,
  viewportHeight: 850,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  chromeWebSecurity: false,
  watchForFileChanges: false,

  // Fans out to both cypress-mochawesome-reporter (rich HTML report, see
  // `npm run report:generate`) and mocha-junit-reporter (JUnit XML, picked
  // up natively by GitLab's merge request test report widget and by most
  // other CI dashboards). Config for each lives in reporter-config.json.
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },

  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    baseUrl: environments.prod.baseUrl,

    setupNodeEvents(on, config) {
      const envName = config.env.ENV || process.env.CYPRESS_ENV || 'prod';
      const envConfig = environments[envName] || environments.prod;

      config.baseUrl = envConfig.baseUrl;
      config.env.apiUrl = envConfig.apiUrl;
      config.env.environmentName = envName;

      cypressMochawesomeReporterPlugin(on);
      require('@cypress/grep/plugin').plugin(config);

      on('task', {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        },
        table(rows) {
          // eslint-disable-next-line no-console
          console.table(rows);
          return null;
        },
      });

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
        }
        return launchOptions;
      });

      return config;
    },
  },
});
