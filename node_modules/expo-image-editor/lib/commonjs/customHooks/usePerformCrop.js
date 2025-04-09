"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePerformCrop = void 0;

var _recoil = require("recoil");

var _Store = require("../Store");

var ImageManipulator = _interopRequireWildcard(require("expo-image-manipulator"));

var _reactNative = require("react-native");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const usePerformCrop = () => {
  const [accumulatedPan] = (0, _recoil.useRecoilState)(_Store.accumulatedPanState);
  const [imageBounds] = (0, _recoil.useRecoilState)(_Store.imageBoundsState);
  const [imageScaleFactor] = (0, _recoil.useRecoilState)(_Store.imageScaleFactorState);
  const [cropSize] = (0, _recoil.useRecoilState)(_Store.cropSizeState);
  const [, setProcessing] = (0, _recoil.useRecoilState)(_Store.processingState);
  const [imageData, setImageData] = (0, _recoil.useRecoilState)(_Store.imageDataState);
  const [, setEditingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState);

  const onPerformCrop = async () => {
    try {
      // Calculate cropping bounds
      const croppingBounds = {
        originX: Math.round((accumulatedPan.x - imageBounds.x) * imageScaleFactor),
        originY: Math.round((accumulatedPan.y - imageBounds.y) * imageScaleFactor),
        width: Math.round(cropSize.width * imageScaleFactor),
        height: Math.round(cropSize.height * imageScaleFactor)
      }; // Set the editor state to processing and perform the crop

      setProcessing(true);
      const cropResult = await ImageManipulator.manipulateAsync(imageData.uri, [{
        crop: croppingBounds
      }]); // Check if on web - currently there is a weird bug where it will keep
      // the canvas from ImageManipualtor at originX + width and so we'll just crop
      // the result again for now if on web - TODO write github issue!

      if (_reactNative.Platform.OS === "web") {
        const webCorrection = await ImageManipulator.manipulateAsync(cropResult.uri, [{
          crop: { ...croppingBounds,
            originX: 0,
            originY: 0
          }
        }]);
        const {
          uri,
          width,
          height
        } = webCorrection;
        setImageData({
          uri,
          width,
          height
        });
      } else {
        const {
          uri,
          width,
          height
        } = cropResult;
        setImageData({
          uri,
          width,
          height
        });
      }

      setProcessing(false);
      setEditingMode("operation-select");
    } catch (error) {
      // If there's an error dismiss the the editor and alert the user
      setProcessing(false);

      _reactNative.Alert.alert("An error occurred while editing.");
    }
  };

  return onPerformCrop;
};

exports.usePerformCrop = usePerformCrop;
//# sourceMappingURL=usePerformCrop.js.map