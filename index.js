function proxy(assert, file, test_count) {
  assert.count = function(n) {
    assert.equal(n, test_count);
    // show test file name & test count
    console.log(file, test_count);
  }
  var methods = Object.keys(assert);
  var orig = assert;
  var proxyed = function() {
    orig.apply(this, arguments);
    test_count++;
  }
  methods.forEach(function(method) {
    var orig_method = assert[method];
    proxyed[method] = function() {
      orig_method.apply(this, arguments);
      test_count++;
    }
  });
  return proxyed;
}

var require_orig = module.constructor.prototype.require;
module.constructor.prototype.require = function() {
  var result = require_orig.apply(this, arguments);
  if (arguments[0] === 'assert') {
    Object.keys(require.cache).forEach(function(k) {
      // if nanotest requires multi time
      // delete from cache for showing
      // correct module.parent.
      // because it's impossible to delete
      // cache of assert.
      if (k.match(/nanotest\/index.js$/)) {
        return delete require.cache[k];
      }
    });
    var file = module.parent.filename.split('/').reverse()[0];
    result = proxy(result, file, 0);
  }
  return result;
};

// fn.toString().match(/function (.*)\(\)/);
// console.log(RegExp.$1);
var tests = [];
function test(fn) {
  if (!fn) {
    var local = tests.slice();
    tests = [];

    function next() {
      if (!local.length) return;
      var t = local.shift();
      if (t.length) return t(next);
      // if test dosen't get arguments
      // execute it syncronous
      t();
      next();
    }
    next();
    return test;
  }
  tests.push(fn);
  return test;
}
module.exports = test;
