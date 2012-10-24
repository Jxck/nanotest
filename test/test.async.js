var test = require('../');
var assert = require('assert');

test(function a(next) {
  setTimeout(function() {
    assert(true);
    assert.ok(true);
    next();
  }, 100);
})(function() {
  assert.deepEqual(1, 1);
})(function b(next) {
  process.nextTick(function() {
    assert.equal('1', 1);
    next();
  });
})(function() {
  assert.count(4);
})();
