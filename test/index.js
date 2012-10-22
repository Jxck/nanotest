var test = require('../');
var assert = require('assert');

test(function() {
  assert(true);
  assert.ok(true);
})(function() {
  assert.equal('1', 1);
  assert.deepEqual(1, 1);
  assert.count(4);
});
