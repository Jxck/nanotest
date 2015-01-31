var test = require('../../');
var assert = require('assert');

test(function(done) {
  setTimeout(function() {
    assert(true);
    assert.ok(true);
    done();
  }, 100);
})(function() {
  var c = 0;
  assert.equal(c++, 0);
  assert.equal(c++, 1);
  assert.equal(c++, 2);
  assert.equal(c++, 3);
})(function(done) {
  process.nextTick(function() {
    assert.equal('1', 1);
    done();
  });
})(function() {
  assert.count(7);
})();
