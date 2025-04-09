"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorContext = void 0;
exports.ImageEditor = ImageEditor;
exports.ImageEditorView = ImageEditorView;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ControlBar = require("./ControlBar");

var _EditingWindow = require("./EditingWindow");

var ImageManipulator = _interopRequireWildcard(require("expo-image-manipulator"));

var _Processing = require("./Processing");

var _recoil = require("recoil");

var _Store = require("./Store");

var _OperationBar = require("./OperationBar/OperationBar");

var _UniversalModal = require("./UniversalModal");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const noScroll = require("no-scroll");

const EditorContext = /*#__PURE__*/React.createContext({
  throttleBlur: true,
  minimumCropDimensions: {
    width: 0,
    height: 0
  },
  fixedAspectRatio: 1.6,
  lockAspectRatio: false,
  mode: "full",
  onCloseEditor: () => {},
  onEditingComplete: () => {}
});
exports.EditorContext = EditorContext;

function ImageEditorCore(props) {
  //
  const {
    mode = "full",
    throttleBlur = true,
    minimumCropDimensions = {
      width: 0,
      height: 0
    },
    fixedCropAspectRatio: fixedAspectRatio = 1.6,
    lockAspectRatio = false,
    allowedTransformOperations,
    allowedAdjustmentOperations
  } = props;
  const [, setImageData] = (0, _recoil.useRecoilState)(_Store.imageDataState);
  const [, setReady] = (0, _recoil.useRecoilState)(_Store.readyState);
  const [, setEditingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState); // Initialise the image data when it is set through the props

  React.useEffect(() => {
    const initialise = async () => {
      if (props.imageUri) {
        const enableEditor = () => {
          setReady(true); // Set no-scroll to on

          noScroll.on();
        }; // Platform check


        if (_reactNative.Platform.OS === "web") {
          let img = document.createElement("img");

          img.onload = () => {
            var _props$imageUri;

            setImageData({
              uri: (_props$imageUri = props.imageUri) !== null && _props$imageUri !== void 0 ? _props$imageUri : "",
              height: img.height,
              width: img.width
            });
            enableEditor();
          };

          img.src = props.imageUri;
        } else {
          const {
            width: pickerWidth,
            height: pickerHeight
          } = await ImageManipulator.manipulateAsync(props.imageUri, []);
          setImageData({
            uri: props.imageUri,
            width: pickerWidth,
            height: pickerHeight
          });
          enableEditor();
        }
      }
    };

    initialise();
  }, [props.imageUri]);

  const onCloseEditor = () => {
    // Set no-scroll to off
    noScroll.off();
    props.onCloseEditor();
  };

  React.useEffect(() => {
    // Reset the state of things and only render the UI
    // when this state has been initialised
    if (!props.visible) {
      setReady(false);
    } // Check if ther mode is set to crop only if this is the case then set the editingMode
    // to crop


    if (mode === "crop-only") {
      setEditingMode("crop");
    }
  }, [props.visible]);
  return /*#__PURE__*/React.createElement(EditorContext.Provider, {
    value: {
      mode,
      minimumCropDimensions,
      lockAspectRatio,
      fixedAspectRatio,
      throttleBlur,
      allowedTransformOperations,
      allowedAdjustmentOperations,
      onCloseEditor,
      onEditingComplete: props.onEditingComplete
    }
  }, /*#__PURE__*/React.createElement(_reactNative.StatusBar, {
    hidden: props.visible
  }), props.asView ? /*#__PURE__*/React.createElement(ImageEditorView, props) : /*#__PURE__*/React.createElement(_UniversalModal.UniversalModal, {
    visible: props.visible,
    presentationStyle: "fullScreen",
    statusBarTranslucent: true
  }, /*#__PURE__*/React.createElement(ImageEditorView, props)));
}

function ImageEditorView(props) {
  //
  const {
    mode = "full"
  } = props;
  const [ready, setReady] = (0, _recoil.useRecoilState)(_Store.readyState);
  const [processing, setProcessing] = (0, _recoil.useRecoilState)(_Store.processingState);
  return /*#__PURE__*/React.createElement(React.Fragment, null, ready ? /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_ControlBar.ControlBar, null), /*#__PURE__*/React.createElement(_EditingWindow.EditingWindow, null), mode === "full" && /*#__PURE__*/React.createElement(_OperationBar.OperationBar, null)) : null, processing ? /*#__PURE__*/React.createElement(_Processing.Processing, null) : null);
}

function ImageEditor(props) {
  //
  return /*#__PURE__*/React.createElement(_recoil.RecoilRoot, null, /*#__PURE__*/React.createElement(ImageEditorCore, props));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222"
  }
});
//# sourceMappingURL=index.js.map