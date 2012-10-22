function proxy(assert) {
  var test_count = 0;
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
    return proxy(orig.apply(this, arguments));
  }
};