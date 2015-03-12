'use strict';

var mockery = require('mockery');

before(function() {
  process.env.NODE_ENV = 'test';
});

beforeEach(function() {
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
  mockery.registerMock('./logger', require('./fixtures/logger-noop')());
  this.helpers = {};

});

afterEach(function() {
  mockery.resetCache();
  mockery.deregisterAll();
  mockery.disable();
});
