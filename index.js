function proxy(assert, test_count) {
  assert.count = function(n) {
    var file = module.parent.filename.split('/').reverse()[0];
    console.log(file, test_count);
    assert.equal(n, test_count);
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

var orig = module.__proto__['require'];
module.__proto__['require'] = function() {
  var result = orig.apply(this, arguments);
  if (arguments[0] === 'assert') {
    result = proxy(result, 0);
  }
  return result;
};

  //fn.toString().match(/function (.*)\(\)/);
  //console.log(RegExp.$1);
var tests = [];
function test(fn) {
  if (!fn) {
    var local = tests.slice();
    tests = [];

    function next() {
      if (!local.length) return;
      var t = local.shift();
      if(t.length) return t(next);
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
