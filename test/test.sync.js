var test = require('../');
var assert = require('assert');

// group
test(function() {

  assert(true);
  assert.ok(true);
  assert.deepEqual(1, 1);

})(function() {

  var c = 0;
  assert.equal(c++, 0);
  assert.equal(c++, 1);
  assert.equal(c++, 2);
  assert.equal(c++, 3);

})(function() {

  assert.count(7);

})();
