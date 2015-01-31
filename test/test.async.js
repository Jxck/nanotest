var test = require('../');
var assert = require('assert');

test(function(done) {

  // test settimeout
  setTimeout(function() {
    assert(true);
    done();
  }, 100);

})(function(done) {

  // shorter than previous
  setTimeout(function() {
    assert(true);
    done();
  }, 10);

})(function(done) {

  // interval
  var c = 0;
  var id = setInterval(function() {
    assert(true);
    if (c++ > 3) {
      clearInterval(id);
      done();
    }
  }, 10);

})(function(done) {

  // immediate
  setImmediate(function() {
    assert(true);
    done();
  });

})(function(done) {

  // nextTick
  process.nextTick(function() {
    assert(true);
    done();
  });

})(function() {

  // count up
  assert.count(9);
})();
