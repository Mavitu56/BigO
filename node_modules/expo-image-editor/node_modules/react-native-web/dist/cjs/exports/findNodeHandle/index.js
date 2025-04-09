'use strict';

exports.__esModule = true;

var _reactDom = require('react-dom');

var findNodeHandle = function findNodeHandle(component) {
  var node = void 0;

  try {
    node = (0, _reactDom.findDOMNode)(component);
  } catch (e) {}

  return node;
}; /**
    * Copyright (c) 2016-present, Nicolas Gallagher.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    *
    * @noflow
    */

exports.default = findNodeHandle;
module.exports = exports['default'];