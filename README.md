# qlecti
A JavaScript utility library for QML delivering consistency, modularity and functionality.

## - under development -

## Installation

## Example
```qml
import "Qlecti.js" as Qlecti
 ...
  Button {
    text: "Click me"
    onClicked: {
      message.text =''
      Qlecti.on(nameField.text.split(' '))
        .op().compact()  // remove extra spaces
        .first(function(k,v){
          print('first: ' + v);
        })
        .last(function(k,v){
          print('last: ' + v);
        })
        .one(function(k,v){
          message.text = "I need another name"
        })
        .empty(function(){
          message.text = "It's empty!!"
        });
    }
  }
```

## Features
 * on(...) supports implicit chaining

