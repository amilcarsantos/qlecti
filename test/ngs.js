.pragma library
.import "vendor/qunit.qt.js" as QUnit
.import "../src/Qlecti.dbg.js" as Ql

function testNgs() {

  var promiseValue;
  function _promise(cb) {
    return promiseValue;
  }

  QUnit.module('ng');

  QUnit.test('easing', function(assert) {
    var curve = {
      type:'linear',
      count: 10,
      max: 20
    };

    assert.equal(_promise(Ql.ng().easing(curve).at(3, function(v, k) {
      promiseValue = Math.ceil(v);
    })) , 8, 'can pull out the first element of an array');
  });

  QUnit.test('loop', function(assert) {
    promiseValue = []
    assert.deepEqual(_promise(Ql.ng().loop(9, 4, function(v, p) {
        console.log(v, p);
      promiseValue.push(v*10 + p);
      })), [91, 102, 113, 124], 'can loop N times starting at X');
  });
}
