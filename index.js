function color(color, text) {
  var ansi  = {
    "off": 0,
    "bold": 1,
    "italic": 3,
    "underline": 4,
    "blink": 5,
    "inverse": 7,
    "hidden": 8,
    "black": 30,
    "red": 31,
    "green": 32,
    "yellow": 33,
    "blue": 34,
    "magenta": 35,
    "cyan": 36,
    "white": 37,
    "black_bg": 40,
    "red_bg": 41,
    "green_bg": 42,
    "yellow_bg": 43,
    "blue_bg": 44,
    "magenta_bg": 45,
    "cyan_bg": 46,
    "white_bg": 47
  };
  var head = "\033[" + ansi[color] + "m";
  var tail = "\033[" + ansi['off'] + "m";
  return head + text + tail;
}
function proxy(assert, file, test_count) {
  assert.count = function(n) {
    assert.equal(n, test_count);
    // show test file name & test count
    console.log(color('green', file), color('yellow', test_count));
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
