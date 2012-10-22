var test = require('../');
var assert = require('assert');

test(function a() {
  assert(true);
  assert.ok(true);
})(function b() {
  assert.equal('1', 1);
  assert.count(3);
});
