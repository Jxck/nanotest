require('./test.async');
require('./test.sync');
require('./mix/test.mix');


var test = require('../');
var assert = require('assert');

// standard
test(function() {

  assert(true);
  assert.ok(true);
  assert.deepEqual(1, 1);

  var c = 0;
  assert.equal(c++, 0);
  assert.equal(c++, 1);
  assert.equal(c++, 2);
  assert.equal(c++, 3);

  assert.count(7);
})();
