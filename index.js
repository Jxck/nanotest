function proxy(assert, test_count) {
  assert.count = function(n) {
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
  if (arguments[0] === 'assert') {
    return proxy(orig.apply(this, arguments), 0);
  }
  return orig.apply(this, arguments);
};

function test(fn) {
  fn();
  //fn.toString().match(/function (.*)\(\)/);
  //console.log(RegExp.$1);
  return test;
}
module.exports = test;
