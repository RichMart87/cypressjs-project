'use strict';

const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  products: '/products',
  cart: '/view_cart',
  deleteAccount: '/delete_account',
  contactUs: '/contact_us',
  testCases: '/test_cases',
  checkout: '/checkout',
  payment: '/payment',
};

const apiEndpoints = {
  productsList: '/productsList',
  brandsList: '/brandsList',
  searchProduct: '/searchProduct',
  verifyLogin: '/verifyLogin',
  createAccount: '/createAccount',
  deleteAccount: '/deleteAccount',
  updateAccount: '/updateAccount',
  getUserDetailByEmail: '/getUserDetailByEmail',
};

const apiResponseCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
};

const apiMessages = {
  METHOD_NOT_SUPPORTED: 'This request method is not supported.',
  USER_EXISTS: 'User exists!',
  USER_NOT_FOUND: 'User not found!',
  USER_CREATED: 'User created!',
  ACCOUNT_DELETED: 'Account deleted!',
  USER_UPDATED: 'User updated!',
  EMAIL_PARAM_MISSING: 'Bad request, email or password parameter is missing in POST request.',
  SEARCH_PARAM_MISSING: 'Bad request, search_product parameter is missing in POST request.',
};

module.exports = {
  routes,
  apiEndpoints,
  apiResponseCode,
  apiMessages,
};
