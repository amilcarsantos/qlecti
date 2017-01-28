import QtQuick 2.0
import "vendor"

import "arrays.js" as Arrays
import "listmodels.js" as ListModels
import "ngs.js" as Ngs


Rectangle {
    //width: 640
    //height: 460
    anchors.fill: parent

    QUnitView {
        id: qunit

        anchors.fill: parent
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
        Ngs.testNgs()

        qunit.load();
    }
}
