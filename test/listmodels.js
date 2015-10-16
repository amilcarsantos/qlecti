
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
      Ql.on(listModel).first(function(k,v) {
        promiseValue = v.data;
    })) , 1, 'can pull out the first element of a ListModel');
	
    promiseValue = '_not_called_';
	assert.equal(_promise(
      Ql.on(createEmptyListModel()).first(function(k,v) {
        promiseValue = 'WTF';
    })) , '_not_called_', 'can skip callback of a empty ListModel');
  });


  QUnit.test('last', function(assert) {
    var listModel = Qt.createQmlObject('import QtQuick 2.0; ListModel {ListElement{data: 1} ListElement{data: 2} ListElement{data: 3}}',
                                   parent, "dynamicListModel" + (modelCount++));
    assert.equal(_promise(Ql.on(listModel).last(function(k,v) {
        promiseValue = v.data;
    })) , 3, 'can pull out the last element of a ListModel');
	
    promiseValue = '_not_called_';
	assert.equal(_promise(
      Ql.on(createEmptyListModel()).last(function(k,v) {
        promiseValue = 'WTF';
    })) , '_not_called_', 'can skip callback of a empty ListModel');
  });


  QUnit.test('empty', function(assert) {
    var listModel = createEmptyListModel();
    assert.equal(_promise(
      Ql.on(listModel).empty(function() {
        promiseValue = '_is_empty_';
    })) , '_is_empty_', 'can notify an empty ListModel');
  });
  
}
