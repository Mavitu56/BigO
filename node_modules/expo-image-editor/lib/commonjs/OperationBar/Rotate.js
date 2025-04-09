"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rotate = Rotate;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _recoil = require("recoil");

var _IconButton = require("../components/IconButton");

var _Store = require("../Store");

var ImageManipulator = _interopRequireWildcard(require("expo-image-manipulator"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Rotate() {
  //
  const [, setProcessing] = (0, _recoil.useRecoilState)(_Store.processingState);
  const [imageData, setImageData] = (0, _recoil.useRecoilState)(_Store.imageDataState);
  const [, setEditingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState);
  const [originalImageData] = React.useState(imageData);
  const [rotation, setRotation] = React.useState(0);
  React.useEffect(() => {
    if (rotation !== 0) {
      onRotate(rotation);
    } else {
      setImageData(originalImageData);
    }
  }, [rotation]);

  const onRotate = async angle => {
    setProcessing(true); // Rotate the image by the specified angle
    // To get rid of thing white line caused by context its being painted onto
    // crop 1 px border off https://github.com/expo/expo/issues/7325

    const {
      uri: rotateUri,
      width: rotateWidth,
      height: rotateHeight
    } = await ImageManipulator.manipulateAsync(originalImageData.uri, [{
      rotate: angle
    }]);
    const {
      uri,
      width,
      height
    } = await ImageManipulator.manipulateAsync(rotateUri, [{
      crop: {
        originX: 1,
        originY: 1,
        width: rotateWidth - 2,
        height: rotateHeight - 2
      }
    }]);
    setImageData({
      uri,
      width,
      height
    });
    setProcessing(false);
  };

  const onClose = () => {
    // If closing reset the image back to its original
    setImageData(originalImageData);
    setEditingMode("operation-select");
  };

  const rotate = direction => {
    const webDirection = _reactNative.Platform.OS === "web" ? 1 : -1;
    let rotateBy = rotation - 90 * webDirection * (direction === "cw" ? 1 : -1); // keep it in the -180 to 180 range

    if (rotateBy > 180) {
      rotateBy = -90;
    } else if (rotateBy < -180) {
      rotateBy = 90;
    }

    setRotation(rotateBy);
  };

  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_reactNative.View, {
    style: [styles.row, {
      paddingHorizontal: "20%"
    }]
  }, /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    iconID: "rotate-left",
    text: "Rotate -90",
    onPress: () => rotate("ccw")
  }), /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    iconID: "rotate-right",
    text: "Rotate +90",
    onPress: () => rotate("cw")
  })), /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.row
  }, /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    iconID: "close",
    text: "Cancel",
    onPress: () => onClose()
  }), /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: styles.prompt
  }, "Rotate"), /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    iconID: "check",
    text: "Done",
    onPress: () => setEditingMode("operation-select")
  })));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  prompt: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center"
  },
  row: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%"
  }
});
//# sourceMappingURL=Rotate.js.map