import QtQuick 2.0
import "vendor"

import "arrays.js" as Arrays
import "listmodels.js" as ListModels

Rectangle {
    //width: 640
    //height: 460
    anchors.fill: parent

    QUnitView {
        id: qunit

        anchors.fill: parent

        property var methods: [];

        appendTest: function(details) {
            //print(details.module, details.testId, details.name)
            if (methods.indexOf(details.name) >= 0) {
                var lastIndex = -1;
                var i = 0;
                while (i < model.count && model.get(i).module != details.name) {
                    i++;
                }
                while (i < model.count && model.get(i).module == details.name) {
                    i++;
                    lastIndex = i;
                }
                if (lastIndex > 0) {
                    model.insert(lastIndex, {
                         name: details.module,
                         _id: details.testId,
                         module: details.name,
                         className: '',
                         message: '',
                         runtime: -1,
                         bad: false
                     })
                }

            } else {
                model.append({
                    name: details.module,
                    _id: details.testId,
                    module: details.name,
                    className: '',
                    message: '',
                    runtime: -1,
                    bad: false
                });
                methods.push(details.name);
            }
        }
    }

    Item {
        width: 0
        height: 0
        id: listModelsParent
    }

    Component.onCompleted: {

        // Load tests
        Arrays.testArrays();
        ListModels.testListModels(listModelsParent);

        qunit.load();
    }
}
