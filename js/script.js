/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

  "use strict";
  
  /* Variable declarations
  ======================================== */
  
  var resultsBox = $("#results"),
    buttonDict = {0: $('#zero'),
                  1: $('#one'),
                  2: $('#two'),
                  3: $('#three'),
                  4: $('#four'),
                  5: $('#five'),
                  6: $('#six'),
                  7: $('#seven'),
                  8: $('#eight'),
                  9: $('#nine'),
                  '.': $('#dot')},
    keyCodeDict = {},
    expression = '',
    decimalInExp = false,
    i,
    key;
  
  for (i = 0; i <= 9; i += 1) {
    keyCodeDict[i + 48] = i; // keyCodes for qwerty side of keyboard
  }
  keyCodeDict[46] = '.';
  
  /* Function declarations
  ======================================== */

  function updateResults(updateHTML) {
    resultsBox.html(updateHTML);
  }
  
  function handlerFactory(key) {
    // function factory branching pattern
    if (!isNaN(key)) { // check if key is a numeric string, e.g. isNaN('1') returns false, isNaN('.') returns true
      return function () {
        expression += key;
        updateResults(expression);
      };
    } else if (key === '.') {
      return function () {
        if (!decimalInExp) { // allow only one decimal point per expression
          decimalInExp = true;
          expression += key;
          updateResults(expression);
        }
      };
    }
  }
  
  /* Click Event Listener Attachments
  ======================================== */
  
  for (key in buttonDict) {
    if (buttonDict.hasOwnProperty(key)) {
      // key is stored in closure with handlerFactory(key)
      buttonDict[key].click(handlerFactory(key)); // handlerFactory applied to return a handler function according to the key
    }
  }
  
  /* Key Press Events
  ======================================== */
  
  $(document).keypress(function (event) {
    var keyCode = event.keyCode;
    if (keyCodeDict.hasOwnProperty(keyCode)) { // Check if keyCode is in keyCodeDict
      buttonDict[keyCodeDict[keyCode]].click();
    }
  });

});