/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {

  "use strict";

  /* Variable declarations
  ======================================== */

  var resultsBox = $("#results"),
    workingsBox = $("#workings"),
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
                  '.': $('#dot'),
                  '+': $('#plus'),
                  '-': $('#minus'),
                  '/': $('#divide'),
                  '*': $('#times')},
    keyCodeDict = {},
    expression = '',
    working = '',
    decimalInExp = false,
    operator = '',
    currentCal = 0,
    currentEx,
    i,
    key;

  for (i = 0; i <= 9; i += 1) {
    keyCodeDict[i + 48] = i; // keyCodes for qwerty side of keyboard
  }
  keyCodeDict[46] = '.';
  keyCodeDict[43] = '+';
  keyCodeDict[45] = '-';
  keyCodeDict[47] = '/';
  keyCodeDict[42] = '*';

  /* Function declarations
  ======================================== */

  function updateResults(updateHTML) {
    resultsBox.html(updateHTML);
  }

  function updateWorkings(updateHTML) {
    workingsBox.html(updateHTML);
  }

  function applyOperator(left, op, right) {
    var returnVal = left;
    switch (op) {
    case "+":
      returnVal = left + right;
      break;
    case "-":
      returnVal = left - right;
      break;
    case "/":
      returnVal = left / right;
      break;
    case "*":
      returnVal = left * right;
      break;
    }
    return returnVal;
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
    } else if (['+', '-', '/', '*'].indexOf(key) !== -1) {
      return function () {
        if (expression) { // Don't do operations if expression is empty, i.e. right after operator is applied

          decimalInExp = false; // reset decimalInExp
          currentEx = parseInt(expression, 10);

          // Update results
          if (operator !== '') {
            currentCal = applyOperator(currentCal, operator, currentEx);
            updateResults(currentCal);
          } else {
            currentCal = currentEx;
            updateResults('');
          }

          operator = key; // Assign up-coming operator

          // Update workings
          if (['/', '*'].indexOf(operator) !== -1) {
            // Add brackets to working for mathematical correctness
            working = ' ( ' + working + ' ' + expression + ' ) ' + key;
          } else {
            working += ' ' + expression + ' ' + key;
          }
          updateWorkings(working);

          expression = ''; // Clear expression

        } else { // Change operator in action if expression is empty

          operator = key;
          working = working.slice(0, -1);

          if (['/', '*'].indexOf(operator) !== -1 && // Add brackets if operator is * or /
              working.slice(-2, -1) !== ')') { // In the case that brackets are already added
            working = '( ' + working + ') ' + key;
          } else {
            working += key;
          }

          updateWorkings(working);

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
    // console.log(keyCode);
    if (keyCodeDict.hasOwnProperty(keyCode)) { // Check if keyCode is in keyCodeDict
      buttonDict[keyCodeDict[keyCode]].click();
    }
  });

});