"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OperationBar = OperationBar;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _Store = require("../Store");

var _recoil = require("recoil");

var _OperationSelection = require("./OperationSelection");

var _Crop = require("./Crop");

var _Rotate = require("./Rotate");

var _Blur = require("./Blur");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function OperationBar() {
  //
  const [editingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState);

  const getOperationWindow = () => {
    switch (editingMode) {
      case "crop":
        return /*#__PURE__*/React.createElement(_Crop.Crop, null);

      case "rotate":
        return /*#__PURE__*/React.createElement(_Rotate.Rotate, null);

      case "blur":
        return /*#__PURE__*/React.createElement(_Blur.Blur, null);

      default:
        return null;
    }
  };

  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_OperationSelection.OperationSelection, null), editingMode !== "operation-select" && /*#__PURE__*/React.createElement(_reactNative.View, {
    style: [styles.container, {
      position: "absolute"
    }]
  }, getOperationWindow()));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    height: 160,
    width: "100%",
    backgroundColor: "#333",
    justifyContent: "center"
  }
});
//# sourceMappingURL=OperationBar.js.map