"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditingWindow = EditingWindow;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ImageCropOverlay = require("./ImageCropOverlay");

var _recoil = require("recoil");

var _Store = require("./Store");

var _expoGl = require("expo-gl");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function EditingWindow() {
  //
  const [imageLayout, setImageLayout] = React.useState(null);
  const [imageData] = (0, _recoil.useRecoilState)(_Store.imageDataState);
  const [, setImageBounds] = (0, _recoil.useRecoilState)(_Store.imageBoundsState);
  const [, setImageScaleFactor] = (0, _recoil.useRecoilState)(_Store.imageScaleFactorState);
  const [editingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState);
  const [, setGLContext] = (0, _recoil.useRecoilState)(_Store.glContextState); // Get some readable boolean states

  const isCropping = editingMode === "crop";
  const isBlurring = editingMode === "blur";
  const usesGL = isBlurring;

  const getImageFrame = layout => {
    onUpdateCropLayout(layout);
  };

  const onUpdateCropLayout = layout => {
    // Check layout is not null
    if (layout) {
      // Find the start point of the photo on the screen and its
      // width / height from there
      const editingWindowAspectRatio = layout.height / layout.width; //

      const imageAspectRatio = imageData.height / imageData.width;
      let bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
      let imageScaleFactor = 1; // Check which is larger

      if (imageAspectRatio > editingWindowAspectRatio) {
        // Then x is non-zero, y is zero; calculate x...
        bounds.x = (imageAspectRatio - editingWindowAspectRatio) / imageAspectRatio * layout.width / 2;
        bounds.width = layout.height / imageAspectRatio;
        bounds.height = layout.height;
        imageScaleFactor = imageData.height / layout.height;
      } else {
        // Then y is non-zero, x is zero; calculate y...
        bounds.y = (1 / imageAspectRatio - 1 / editingWindowAspectRatio) / (1 / imageAspectRatio) * layout.height / 2;
        bounds.width = layout.width;
        bounds.height = layout.width * imageAspectRatio;
        imageScaleFactor = imageData.width / layout.width;
      }

      setImageBounds(bounds);
      setImageScaleFactor(imageScaleFactor);
      setImageLayout({
        height: layout.height,
        width: layout.width
      });
    }
  };

  const getGLLayout = () => {
    if (imageLayout) {
      const {
        height: windowHeight,
        width: windowWidth
      } = imageLayout;
      const windowAspectRatio = windowWidth / windowHeight;
      const {
        height: imageHeight,
        width: imageWidth
      } = imageData;
      const imageAspectRatio = imageWidth / imageHeight; // If the window is taller than img...

      if (windowAspectRatio < imageAspectRatio) {
        return {
          width: windowWidth,
          height: windowWidth / imageAspectRatio
        };
      } else {
        return {
          height: windowHeight,
          width: windowHeight * imageAspectRatio
        };
      }
    }
  };

  React.useEffect(() => {
    onUpdateCropLayout(imageLayout);
  }, [imageData]);

  const onGLContextCreate = async gl => {
    setGLContext(gl);
  };

  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.container
  }, usesGL ? /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.glContainer
  }, /*#__PURE__*/React.createElement(_expoGl.GLView, {
    style: [{
      height: 1,
      width: 1,
      backgroundColor: "#ccc",
      transform: [{
        scaleY: -1
      }]
    }, getGLLayout()],
    onContextCreate: onGLContextCreate
  })) : /*#__PURE__*/React.createElement(_reactNative.Image, {
    style: styles.image,
    source: {
      uri: imageData.uri
    },
    onLayout: ({
      nativeEvent
    }) => getImageFrame(nativeEvent.layout)
  }), isCropping && imageLayout != null ? /*#__PURE__*/React.createElement(_ImageCropOverlay.ImageCropOverlay, null) : null);
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    resizeMode: "contain"
  },
  glContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
//# sourceMappingURL=EditingWindow.js.map