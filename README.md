# nanotest

simplest API for support,

- test():         for write test syncronous.
- test(done):     for write test asyncronous.
- assert.count(): for auto count of executed assert count.

## how to use

### API

pass the function with asserts to `test()`.

```js
test(function() {
  // sync test
})();
```

get the `done` from `test()` and use it for async test.

```js
test(function(done) {
  // async test with done
});
```

nanotest injects `assert.count()` and count up assert called count.
and you can check that count with `assert.count()`.


```js
test(function() {
  // sync test * 10

  assert.count(10);
})();
```


### test with sync

call `assert.count`

```js
var test = require('../');
var assert = require('assert');

// group
test(function() {

  assert(true);
  assert.ok(true);
  assert.deepEqual(1, 1);

  var c = 0;
  assert.equal(c++, 0);
  assert.equal(c++, 1);
  assert.equal(c++, 2);
  assert.equal(c++, 3);

})(function() {

  // countup
  assert.count(7);

})();

```

### test with async

```js
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
```



## Author

The MIT License (MIT)
Copyright (c) 2013 Jxck
