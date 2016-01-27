import QtQuick 2.1
import QtQuick.Controls 1.1

import "vendor/qunit.qt.js" as QUnit
import "arrays.js" as Arrays
import "listmodels.js" as ListModels
import "ngs.js" as Ngs


Rectangle {
    width: 640
    height: 460

    Timer {
        property var _callback;
        id: _timeout
        running: false
        repeat: false;
        onTriggered: {
            _callback.call(undefined);
        }
    }

	Label {
		id: header
		text: "Qlecti Test Suite"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        font.pixelSize: 20
	}
	
	ListModel {
		id: testModel
		
		function getById(id) {
			for (var i = 0; i < count; i++) {
				if (get(i)._id == id) {
					return get(i);
				}
			}
		}
		
		function appendTest(name, id, module) {
			append({
				name: name,
				_id: id,
				module: module,
				className: '',
				message: '',
                runtime: -1,
                bad: false
			})
		}
	}
	
    // The delegate for each section header
    Component {
        id: sectionHeading
        Rectangle {
            width: parent.width
            height: childrenRect.height
            color: "lightsteelblue"
            Text {
                width: parent.width - 20
                text: section
                font.bold: true
                font.pixelSize: 20
                horizontalAlignment: Text.AlignRight
            }
        }
    }

	ListView {
        id: listView
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: header.bottom
        anchors.bottom: footer.top
        clip: true
		
		model: testModel
		
        delegate: Component {
            Item {
                id: delegateItem
                width: listView.width;
                height: col.height
                clip: true
                Column {
                    id: col
                    width: parent.width
                    Text {
                        width: parent.width - 2
                        x: 2
                        height: 16
                        text: _toString(model)
                        font.pixelSize: 16

                        function _toString(model) {
                            var s = model.name;
                            if (model.className !== '') {
                                s += ' - '  + model.className;
                            }
                            if (model.runtime >= 0) {
                                s += ' - '  + model.runtime + 'ms';
                            }
                            return  s;
                        }
                    }
                    Text {
                        width: parent.width - 10
                        //height: 16
                        x: 10
                        text: model.message
                        font.pixelSize: 12
                        color: 'gray'
                    }
                }
            }
        }
        focus: true
        section.property: "module"
        section.criteria: ViewSection.FullString
        section.delegate: sectionHeading
	}

    Label {
        id: footer
        text: ''
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: btn.top
        font.pixelSize: 14
    }

    Button {
        id: btn
        text: "quit"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottomMargin: 6
        anchors.bottom: parent.bottom

        onClicked: {
            Qt.quit();
        }
    }
    Keys.onPressed: {
        if (event.key === Qt.Key_Escape) {
            Qt.quit();
        }
    }

    Item {
        width: 0
        height: 0
        id: listModelsParent
    }
	
    Component.onCompleted: {
		QUnit.loggingCallback('testStart', function(details) {
			var running, testBlock, bad;

			testBlock = testModel.getById(details.testId);
			
			if (testBlock) {
				testBlock.className = 'running';
			} else {
				// Report later registered tests
				testModel.appendTest(details.name, details.testId, details.module);
			}
		});

		QUnit.loggingCallback('log', function(details) {
			var testItem = testModel.getById(details.testId);

			if (!testItem) {
				return;
			}
            if (testItem.message) {
                testItem.message += '<br>'
            }
            if (details.result) {
                testItem.message += details.message || "okay";
            } else {
                testItem.message += ('<font color="red">' + details.message + ' - failed</font>').replace('\n', '<br>');
            }
			testItem.runtime = details.runtime;
		});
		
		QUnit.loggingCallback('testDone', function(details) {
            //print('testDone', JSON.stringify(details));
            var testItem = testModel.getById(details.testId);

            if (testItem) {
                testItem.className = details.skipped ? "skipped" : (details.failed === 0 ? "okay" : "failed");
                testItem.bad = details.failed > 0;
            }
		});

		QUnit.loggingCallback('begin', function(details) {
			var i, l, x, z, test, moduleObj;
			for ( i = 0, l = details.modules.length; i < l; i++ ) {
				moduleObj = details.modules[i];
				//if (moduleObj.name) {
				//	modulesList.push(moduleObj.name );
				//}
				for (x = 0, z = moduleObj.tests.length; x < z; x++) {
					test = moduleObj.tests[x];
					testModel.appendTest(test.name, test.testId, moduleObj.name);
				}
			}
		});

		QUnit.loggingCallback('done', function(details) {
            //print('done', JSON.stringify(details));
            footer.text = 'Passed: %1 - Failed: %2 - Total: %3 - Time: %4ms'
                .arg(details.passed).arg(details.failed).arg(details.total).arg(details.runtime);
		});
		
        // Load tests
        Arrays.testArrays();
        ListModels.testListModels(listModelsParent);
        Ngs.testNgs()

        QUnit.load(_timeout);
	}
}

