// colorise
// add ansi escape sequence to text
function color(color, text) {
  var ansi = {
    'off'       :0,
    'bold'      :1,
    'italic'    :3,
    'underline' :4,
    'blink'     :5,
    'inverse'   :7,
    'hidden'    :8,
    'black'     :30,
    'red'       :31,
    'green'     :32,
    'yellow'    :33,
    'blue'      :34,
    'magenta'   :35,
    'cyan'      :36,
    'white'     :37,
    'black_bg'  :40,
    'red_bg'    :41,
    'green_bg'  :42,
    'yellow_bg' :43,
    'blue_bg'   :44,
    'magenta_bg':45,
    'cyan_bg'   :46,
    'white_bg'  :47
  };
  var head = '\033[' + ansi[color] + 'm';
  var tail = '\033[' + ansi['off'] + 'm';
  return head + text + tail;
}

/**
 * proxy the assert methods
 * basically dosen't change
 * assert original behavior
 * but make them count number
 * of executed time.
 *
 * finally, you can check
 * expected assertion count with
 * assert.count(n)
 *
 * test(function() {
 *   assert(true);
 *   (function() {
 *     // you can find
 *     // miss like this.
 *     assert.equal(true);
 *   });
 *   // make sure two asserts
 *   // has passed
 *   assert.count(2);
 * })()
 */
function proxy(assert, file, test_count) {

  // add count() to assert
  // checking the number of exected assert
  // and also shows the name of testfile
  assert.count = function(n) {
    assert.equal(n, test_count);
    // show test file name & test count
    console.log(color('green', test_count), color('yellow', file));
  }

  var methods = Object.keys(assert);
  var orig_assert = assert;

  // proxy assert(true) with countup
  var proxyed_assert = function() {
    orig_assert.apply(this, arguments);
    test_count++;
  }

  // proxy assert.foo() with countup
  methods.forEach(function(method) {
    var orig_method = assert[method];
    proxyed_assert[method] = function() {
      orig_method.apply(this, arguments);
      test_count++;
    }
  });

  return proxyed_assert;
}

// proxy the require()
// for changing assert behavior
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
    var file = '.' + module.parent.filename.replace(__dirname, '');
    result = proxy(result, file, 0);
  }
  return result;
};

/**
 * this is the test() which makes test case.
 * you can execute test() with
 * giving testcase function one by one.
 * if you got next in testcase
 * you can use it for async test
 *
 * sync test
 *
 * test(function() {
 *   assert(true);
 * })(function() {
 *   assert(true);
 * })(function() {
 *   assert(true);
 *   assert.count(3);
 * })();
 *
 * don't forget last execution!
 *
 * async test
 *
 * test(function(next) {
 *   async_func(function() {
 *     assert(true);
 *     next();
 *   });
 * })(function() {
 *   // you can mix sync & async
 *   // without geting next is sync test
 *   assert(true);
 * })(function(next) {
 *   async_func(function() {
 *     assert(true);
 *     next();
 *   });
 * })(function() {
 *   assert.count(3);
 * });
 *
 */
var tests = [];
function test(fn) {
  if (!fn) {
    // copy tests array
    // and make tests empty
    // for another test file
    var local = tests.slice();
    tests = [];

    function next() {
      if (!local.length) return;
      var t = local.shift();

      // if test gets next
      // pass next and handle as asyncronous
      if (t.length) return t(next);

      // if test dosen't get arguments
      // handle as syncronous
      t(); next();
    }
    next();
    return test;
  }
  tests.push(fn);
  return test;
}

module.exports = test;
