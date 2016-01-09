import QtQuick 2.1
import QtQuick.Controls 1.0
import "../../src/Qlecti.js" as Qlecti


Rectangle {
    width: 640
    height: 480

    Column {
        anchors.centerIn: parent
        spacing: 2

        Text {
            text: "Enter your name:"
        }
        TextField {
            id: nameField
            width: 200
        }
        Text {
            id: message
            text: ""
        }
        Button {
            text: "Click me"
            onClicked: {
                var firstName, lastName;
                message.text =''
                Qlecti.on(nameField.text.split(' '))
                    .op().compact()  // remove extra spaces
                    .first(function(v){
                        firstName = v;
                    })
                    .last(function(v){
                        lastName = v;
                    })
                    .one(function(v){
                        message.text = "I need another name"
                    })
                    .empty(function(){
                        message.text = "It's empty!!"
                    });
                if (firstName && lastName) {
                    print(firstName, lastName);
                }
            }
        }
    }

    Button {
        text: "quit"
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottomMargin: 10

        onClicked: {
            Qt.quit();
        }
    }
}
