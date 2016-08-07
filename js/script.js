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
                  '*': $('#times'),
                  'enter': $('#enter'),
                  'ce': $('#ce'),
                  'ac': $('#ac')},
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
  keyCodeDict[13] = 'enter';
  keyCodeDict[61] = 'enter';

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

  function evalResults() {
    decimalInExp = false; // reset decimalInExp
    currentEx = parseFloat(expression, 10);

    // Update results
    if (operator) {
      currentCal = applyOperator(currentCal, operator, currentEx);
      updateResults(currentCal);
    } else { // Case: initial number before operator is assigned
      currentCal = currentEx;
      updateResults('');
    }

  }

  function handlerFactory(key) {
    // function factory branching pattern
    // 1-9 buttons
    if (!isNaN(key) && key) { // check if key is a numeric string, e.g. isNaN('1') returns false, isNaN('.') returns true
      return function () {
        buttonDict[key].blur(); // Unfocus button when clicked to prevent side-effects when use 'enter' key
        expression += key;
        updateResults(expression);
        if (operator === '=') { // right after pressing enter, entering numbers = intend to start new calculation
          decimalInExp = false;
          operator = '';
          working = '';
          currentCal = 0;
          updateWorkings(working);
        }
      };
    // decimal point button
    } else if (key === '.') {
      return function () {
        buttonDict[key].blur();
        if (!decimalInExp) { // allow only one decimal point per expression
          decimalInExp = true;
          expression += key;
          updateResults(expression);
        }
      };
    // ce button
    } else if (key === 'ce') {
      return function () {
        buttonDict[key].blur();
        decimalInExp = false;
        expression = '';
        updateResults('0');
      };
    // ac button
    } else if (key === 'ac') {
      return function () {
        buttonDict[key].blur();
        decimalInExp = false;
        expression = '';
        operator = '';
        working = '';
        currentCal = 0;
        updateResults('0');
        updateWorkings(working);
      };
    // operator buttons
    } else if (['+', '-', '/', '*'].indexOf(key) !== -1) {
      return function () {
        buttonDict[key].blur();
        if (expression) { // Don't do operations if expression is empty, i.e. right after operator is applied

          evalResults();
          // Update workings
          if (['/', '*'].indexOf(key) !== -1 &&
              operator) { // don't add brackets when currentCal is still zero
            // Add brackets to working for mathematical correctness
            working = ' ( ' + working + ' ' + currentEx + ' ) ' + key;
          } else if (operator) {
            working += ' ' + currentEx + ' ' + key;
          } else { // case: no operator assigned yet, first number
            working += currentEx + ' ' + key;
          }
          operator = key; // Assign up-coming operator
          updateWorkings(working);
          expression = ''; // Clear expression

        } else if (currentCal !== 0) { // Change operator in action if expression is empty and currentCal is not zero i.e. something is operable
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
    // enter button
    } else if (key === 'enter') {
      return function () {
        buttonDict[key].blur();
        if (expression && operator) { // Don't do evaluation if expression is empty, i.e. right after operator is applied
          evalResults();
          operator = '=';
          working += ' ' + currentEx + ' =';
          updateWorkings(working);
          expression = '';
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