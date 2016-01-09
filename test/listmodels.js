.pragma library
.import "vendor/qunit.qt.js" as QUnit
.import "../src/Qlecti.js" as Ql

function testListModels(parent) {

  var promiseValue,
    modelCount = 1;
  function _promise(cb) {
	return promiseValue;
  }
  
  function createEmptyListModel() {
	  return Qt.createQmlObject('import QtQuick 2.0; ListModel {}',
                                   parent, "dynamicListModel" + (modelCount++));
  }
  
  QUnit.module('ListModels');
  
  QUnit.test('first', function(assert) {
    var listModel = Qt.createQmlObject('import QtQuick 2.0; ListModel {ListElement{data: 1} ListElement{data: 2}}',
                                   parent, "dynamicListModel" + (modelCount++));
    assert.equal(_promise(
      Ql.on(listModel).first(function(v,k) {
        promiseValue = v.data;
    })) , 1, 'can pull out the first element of a ListModel');
	
    promiseValue = '_not_called_';
	assert.equal(_promise(
      Ql.on(createEmptyListModel()).first(function(v,k) {
        promiseValue = 'WTF';
    })) , '_not_called_', 'can skip callback of a empty ListModel');
  });


  QUnit.test('each', function(assert) {
    var listModel = Qt.createQmlObject('import QtQuick 2.0; ListModel {ListElement{data: 2} ListElement{data: 3} ListElement{data: 1} ListElement{data: 4}}',
                                   parent, "dynamicListModel" + (modelCount++));
    promiseValue = [];
    assert.deepEqual(_promise(Ql.on(listModel).each(function(v,k) {
      promiseValue.push(v.data * 10 + k);
    })), [20, 31, 12, 43], 'can loop each element in ListModel');
    promiseValue = [];
    assert.deepEqual(_promise(Ql.on(listModel).each(function(v,k) {
      promiseValue.push(v.data * 10 + k);
      if (k>=1) return false;
    })), [20, 31], 'can break loop in "each"');
    promiseValue = '_is_empty_';
    assert.equal(_promise(Ql.on(createEmptyListModel()).each(function(v,k) {
      promiseValue = v;
    })) , '_is_empty_', 'can skip callback of an empty ListModel');
    promiseValue = [];
  });


  QUnit.test('last', function(assert) {
    var listModel = Qt.createQmlObject('import QtQuick 2.0; ListModel {ListElement{data: 1} ListElement{data: 2} ListElement{data: 3}}',
                                   parent, "dynamicListModel" + (modelCount++));
    assert.equal(_promise(Ql.on(listModel).last(function(v,k) {
        promiseValue = v.data;
    })) , 3, 'can pull out the last element of a ListModel');
	
    promiseValue = '_not_called_';
	assert.equal(_promise(
      Ql.on(createEmptyListModel()).last(function(v,k) {
        promiseValue = 'WTF';
    })) , '_not_called_', 'can skip callback of a empty ListModel');
  });


  QUnit.test('empty', function(assert) {
    var listModel = createEmptyListModel();
    assert.equal(_promise(
      Ql.on(listModel).empty(function() {
        promiseValue = '_is_empty_';
    })) , '_is_empty_', 'can notify an empty ListModel');
    promiseValue = '_not_called_';
	var listModel = Qt.createQmlObject('import QtQuick 2.0; ListModel {ListElement{data: 1} ListElement{data: 2}}',
                                   parent, "dynamicListModel" + (modelCount++));
    assert.equal(_promise(Ql.on(listModel).empty(function() {
        promiseValue = 'is_empty';
    })), '_not_called_', 'can skip an non empty ListModel');
  });
  

  QUnit.test('compact', function(assert) {
   var listModel = Qt.createQmlObject('import QtQuick 2.0; ListModel {ListElement{name:""; data: 1} ListElement{name:"2"; data: 2} ListElement{name:"3"; data: 0} ListElement{name:"4"; data: 0}}',
									parent, "dynamicListModel" + (modelCount++));
    assert.equal(Ql.on(listModel).op().compact()
          .ret().val().length , 3, 'can trim out all falsy values (default field "name"")');
    assert.equal(Ql.on(listModel).op().compact('data')
          .ret().val().length , 2, 'can trim out all falsy values (custom field)');
  });

}
