# Qlecti
A JavaScript utility library for QML delivering consistency, modularity and functionality.

## - UNDER DEVELOPMENT -
Things will change without warning!

## Installation
TODO

## Documentation

You can read the Qlecti documentation at: [Wiki](https://github.com/amilcarsantos/qlecti/wiki).

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
        .first(function(v,k){
          print('first: ' + v);
        })
        .last(function(v,k){
          print('last: ' + v);
        })
        .one(function(v,k){
          message.text = "I need another name"
        })
        .empty(function(){
          message.text = "It's empty!!"
        });
    }
  }
```

## Features
 * `on(...)` supports implicit chaining
 * `on(...).op().filter('....')` filters objects like XPath (goessner.net/articles/JsonPath/) - under development -
 * `ng().easing(...)` easing equations (danro/easing-js) - under development -

