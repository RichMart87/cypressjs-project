# AutomationExercise Cypress Framework

A Cypress (JavaScript) test automation framework targeting
[automationexercise.com](https://automationexercise.com):

- **UI suite** — implements all 26 documented scenarios from
  [automationexercise.com/test_cases](https://automationexercise.com/test_cases).
- **API suite** — covers all 14 documented endpoints from
  [automationexercise.com/api_list](https://automationexercise.com/api_list).

Built with the Page Object Model, data-driven fixtures, custom commands, tag-based
test selection, multi-reporter output (HTML + JUnit), and CI/CD pipelines for both
GitHub Actions and GitLab CI.

## Stack

| Concern              | Choice                                                    |
| --------------------- | ---------------------------------------------------------- |
| Test runner           | [Cypress](https://cypress.io)                              |
| Test data              | [@faker-js/faker](https://fakerjs.dev) (generated per run) |
| Tag filtering          | [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) |
| Reporting              | `cypress-mochawesome-reporter` (HTML) + `mocha-junit-reporter` (JUnit XML) via `cypress-multi-reporters` |
| Lint / format          | ESLint (flat config, `eslint-plugin-cypress`) + Prettier   |
| CI/CD                  | GitHub Actions and GitLab CI                                |

## Project structure

```
cypress/
  e2e/
    api/                     # API 1-14 (automationexercise.com/api_list)
    ui/
      01-account/            # TC1-5   register/login/logout
      02-navigation/         # TC6-7   contact us, test cases page
      03-products/           # TC8-9, 18-19, 21-22   products, search, category, brand, review, recommended
      04-cart/                # TC10-13, 17, 20   subscription, cart, quantity, remove, search+login
      05-checkout/            # TC14-16, 23-24   checkout & payment flows
      06-misc/                 # TC25-26   scroll behavior
  fixtures/                   # Static test data (invalid user, search terms, upload file)
  support/
    commands.js               # Cross-cutting custom commands (API helpers, session login)
    e2e.js                     # Global support file (grep, reporter, uncaught:exception policy)
    pageObjects/                # One class per page/component (Page Object Model)
  utils/
    dataGenerator.js            # Faker-backed builders for users/cards/comments
    constants.js                 # Routes, API endpoints, response codes/messages
cypress.config.js               # Env resolution, reporter wiring, timeouts, plugins
reporter-config.json             # cypress-multi-reporters config (HTML + JUnit)
.github/workflows/cypress-tests.yml
.gitlab-ci.yml
```

### Why Page Objects here

Every page object extends `BasePage` and exposes intention-revealing methods
(`loginPage.login(email, password)`, `cartPage.proceedToCheckout()`) rather than
raw selectors, so:

- Specs read as the same steps documented on the site's own `/test_cases` page.
- A DOM/selector change is a one-line fix in a page object instead of a
  find-and-replace across specs.
- `HeaderNav` centralizes navigation and is deliberately scoped to
  `.nav.navbar-nav` — the home page's hero carousel repeats several nav hrefs
  (`/products`, `/test_cases`, ...) in unrelated call-to-action buttons, which
  would otherwise resolve `cy.click()` against multiple elements.

## Getting started

```bash
npm install
npx cypress verify   # first run only, downloads/verifies the Cypress binary
```

### Running tests

```bash
npm run cy:open          # interactive runner
npm test                 # full suite, headless (default browser)
npm run test:ui           # UI suite only
npm run test:api          # API suite only
npm run test:chrome       # full suite in Chrome
npm run test:firefox      # full suite in Firefox
npm run test:edge         # full suite in Edge
npm run test:smoke        # only specs/tests tagged @smoke
npm run test:regression   # only specs/tests tagged @regression
```

Every UI spec is tagged `@ui` plus either `@smoke` or `@regression`; every API
spec is tagged `@api` plus `@smoke` or `@regression` per `it()`. Combine tags
via `cypress-grep`, e.g.:

```bash
npx cypress run --env grep=@smoke,grepFilterSpecs=true
```

### Linting & formatting

```bash
npm run lint          # eslint
npm run lint:fix
npm run format:check  # prettier --check
npm run format
npm run verify         # lint + format:check (what CI runs first)
```

## Environments

`cypress.config.js` resolves a named environment (`prod`/`qa`, both currently
pointed at the single public site) via `CYPRESS_ENV`:

```bash
npm run cy:open:qa                     # cross-env CYPRESS_ENV=qa
CYPRESS_ENV=qa npx cypress run         # equivalent, POSIX shells
```

This is wired for the multi-environment setup a real internal application
would need (dev/qa/staging/prod with different base + API URLs); add entries
to the `environments` map in `cypress.config.js` as needed. No secrets are
required for this project (the target API needs no auth tokens) — if a future
environment does, put them in a git-ignored `cypress.env.json` locally and in
masked/protected CI variables in the pipeline, never hardcoded into config.

## Test data strategy

- **UI-only setup** (e.g. logging in) uses `cy.session()` so repeated logins
  across specs in one run pay the UI cost once (`cy.loginViaUi` in
  `support/commands.js`).
- **Cross-cutting setup/teardown** (seeding "an existing account" for a
  negative-login or duplicate-email test) goes through the API
  (`cy.createUserViaApi` / `cy.deleteUserViaApi`), never hardcoded fixture
  accounts — this is a shared public sandbox, so every test generates its own
  unique random user via `buildRandomUser()` and cleans up after itself.
- Specs that both create *and* delete an account through the UI (matching the
  site's own documented steps, e.g. Test Case 1) don't need an extra
  API-based `after` hook; specs that stop short of the UI-delete step do.

## Reporting

Every run produces:

- `cypress/reports/mochawesome/` — merged HTML report with embedded
  screenshots (open `index.html`).
- `cypress/reports/junit/` — JUnit XML per spec, consumed natively by
  GitLab's MR test-report widget and most other CI dashboards.

```bash
npm run report:clean   # wipe reports/screenshots/videos/downloads
```

## CI/CD

### GitHub Actions (`.github/workflows/cypress-tests.yml`)

- `lint` → `api-tests` + `ui-tests` (needs `lint`).
- `ui-tests` is a matrix over `{chrome, firefox, edge} x {spec group 1, 2}` so
  the 26 UI specs parallelize across 6 runners instead of running serially in
  one browser.
- Runs on push/PR to `main`, nightly at 03:00 UTC (catches upstream site
  regressions independent of code changes), and manually via
  `workflow_dispatch`.
- Uploads the mochawesome/JUnit report, and screenshots + video, as build
  artifacts (screenshots only on failure).

### GitLab CI (`.gitlab-ci.yml`)

- Uses the official `cypress/browsers` image (Chrome, Firefox and Edge
  preinstalled) so no browser-install step is needed.
- `lint` → `api-tests` + `ui-tests:{chrome,firefox,edge}` (2-way parallel
  matrix each, same odd/even spec split as GitHub Actions).
- `api-tests` publishes `junit` artifacts so pass/fail surfaces directly in
  the merge request widget.
- `node_modules`/npm cache keyed on `package-lock.json`.

Both pipelines run `npm run lint` and `npm run format:check` before any
browser is launched, so a style or syntax problem fails fast without burning
CI minutes on a real browser run.

## Coverage traceability

| # | Official Test Case | Spec file |
| - | -------------------- | ----------- |
| 1 | Register User | `ui/01-account/register-user.cy.js` |
| 2 | Login with correct credentials | `ui/01-account/login-logout.cy.js` |
| 3 | Login with incorrect credentials | `ui/01-account/login-logout.cy.js` |
| 4 | Logout User | `ui/01-account/login-logout.cy.js` |
| 5 | Register with existing email | `ui/01-account/register-existing-email.cy.js` |
| 6 | Contact Us Form | `ui/02-navigation/contact-us.cy.js` |
| 7 | Verify Test Cases Page | `ui/02-navigation/test-cases-page.cy.js` |
| 8 | All Products & product detail page | `ui/03-products/products-and-details.cy.js` |
| 9 | Search Product | `ui/03-products/search-product.cy.js` |
| 10 | Subscription on home page | `ui/04-cart/subscription.cy.js` |
| 11 | Subscription on cart page | `ui/04-cart/subscription.cy.js` |
| 12 | Add Products in Cart | `ui/04-cart/add-to-cart.cy.js` |
| 13 | Verify Product quantity in Cart | `ui/04-cart/product-quantity.cy.js` |
| 14 | Place Order: Register while Checkout | `ui/05-checkout/register-while-checkout.cy.js` |
| 15 | Place Order: Register before Checkout | `ui/05-checkout/register-before-checkout.cy.js` |
| 16 | Place Order: Login before Checkout | `ui/05-checkout/login-before-checkout.cy.js` |
| 17 | Remove Products From Cart | `ui/04-cart/remove-from-cart.cy.js` |
| 18 | View Category Products | `ui/03-products/category-products.cy.js` |
| 19 | View & Cart Brand Products | `ui/03-products/brand-products.cy.js` |
| 20 | Search Products and Verify Cart After Login | `ui/04-cart/search-and-cart-after-login.cy.js` |
| 21 | Add review on product | `ui/03-products/product-review.cy.js` |
| 22 | Add to cart from Recommended items | `ui/03-products/recommended-items.cy.js` |
| 23 | Verify address details in checkout page | `ui/05-checkout/address-details-checkout.cy.js` |
| 24 | Download Invoice after purchase order | `ui/05-checkout/download-invoice.cy.js` |
| 25 | Scroll Up using the Arrow button | `ui/06-misc/scroll-with-arrow.cy.js` |
| 26 | Scroll Up without the Arrow button | `ui/06-misc/scroll-without-arrow.cy.js` |

| API # | Endpoint | Spec file |
| ----- | ---------- | ----------- |
| 1-2 | `GET`/`POST /productsList` | `api/products-list.cy.js` |
| 3-4 | `GET`/`PUT /brandsList` | `api/brands-list.cy.js` |
| 5-6 | `POST /searchProduct` (with/without param) | `api/search-product.cy.js` |
| 7-10 | `POST`/`DELETE /verifyLogin` (valid/missing/invalid) | `api/verify-login.cy.js` |
| 11-14 | `createAccount` → `getUserDetailByEmail` → `updateAccount` → `deleteAccount` | `api/account-lifecycle.cy.js` |

## Known quirks of the target site (already handled)

These were discovered by actually running the suite against the live site and
are handled in the framework so specs stay readable:

- **API responses are mislabeled `Content-Type: text/html`** even though the
  body is JSON, so Cypress won't auto-parse it. `cy.apiRequest` (in
  `support/commands.js`) parses `response.body` itself.
- **The API always answers HTTP 200 at the transport level**, even for
  405/400/404 cases — the real status lives in the JSON body's
  `responseCode` field. Every API spec asserts on `response.body.responseCode`,
  not `response.status`, for the semantic outcome.
- **Several nav hrefs are duplicated** in the home page's hero carousel
  call-to-action buttons. `HeaderNav` scopes all lookups to
  `.nav.navbar-nav` to avoid matching multiple elements.
- **Category/brand/order-confirmation headings are visually uppercased via
  CSS** (`text-transform`) but the actual DOM text is mixed-case — assertions
  against that text use case-insensitive matching.
- **The site's product search matches loosely** (name/category/brand, not a
  strict name substring) and can legitimately return tangentially-related
  items. Test Case 9 asserts the result set is non-empty and includes the
  expected exact match, rather than requiring every result to contain the
  search term.
- **Invoice download** is verified by asserting the "Download Invoice" link
  resolves with a real 200 response (`cy.request`) rather than reading an
  OS-level file from the Cypress downloads folder, which behaves
  inconsistently across the headless Chrome/Firefox/Edge matrix used in CI.
