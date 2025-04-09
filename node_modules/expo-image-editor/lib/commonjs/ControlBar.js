"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlBar = ControlBar;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _recoil = require("recoil");

var _Store = require("./Store");

var _IconButton = require("./components/IconButton");

var _index = require("./index");

var _usePerformCrop = require("./customHooks/usePerformCrop");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ControlBar() {
  //
  const [editingMode, setEditingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState);
  const [imageData] = (0, _recoil.useRecoilState)(_Store.imageDataState);
  const [processing, setProcessing] = (0, _recoil.useRecoilState)(_Store.processingState);
  const {
    mode,
    onCloseEditor,
    onEditingComplete
  } = (0, React.useContext)(_index.EditorContext);
  const performCrop = (0, _usePerformCrop.usePerformCrop)();
  const shouldDisableDoneButton = editingMode !== "operation-select" && mode !== "crop-only";

  const onFinishEditing = async () => {
    if (mode === "full") {
      setProcessing(false);
      onEditingComplete(imageData);
      onCloseEditor();
    } else if (mode === "crop-only") {
      await performCrop();
    }
  };

  const onPressBack = () => {
    if (mode === "full") {
      if (editingMode === "operation-select") {
        onCloseEditor();
      } else {
        setEditingMode("operation-select");
      }
    } else if (mode === "crop-only") {
      onCloseEditor();
    }
  }; // Complete the editing process if we are in crop only mode after the editingMode gets set
  // back to operation select (happens internally in usePerformCrop) - can't do it in onFinishEditing
  // else it gets stale state - may need to refactor the hook as this feels hacky


  (0, React.useEffect)(() => {
    if (mode === "crop-only" && imageData.uri && editingMode === "operation-select") {
      onEditingComplete(imageData);
      onCloseEditor();
    }
  }, [imageData, editingMode]);
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    iconID: "arrow-back",
    text: "Back",
    onPress: onPressBack
  }), /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    iconID: "done",
    text: "Done",
    onPress: onFinishEditing,
    disabled: shouldDisableDoneButton
  }));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4
  }
});
//# sourceMappingURL=ControlBar.js.map