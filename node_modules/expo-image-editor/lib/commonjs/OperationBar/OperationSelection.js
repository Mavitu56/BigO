"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OperationSelection = OperationSelection;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _Icon = require("../components/Icon");

var _IconButton = require("../components/IconButton");

var _Store = require("../Store");

var _recoil = require("recoil");

var _ = require("..");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const operations = {
  transform: [{
    title: "Crop",
    iconID: "crop",
    operationID: "crop"
  }, {
    title: "Rotate",
    iconID: "rotate-90-degrees-ccw",
    operationID: "rotate"
  }],
  adjust: [{
    title: "Blur",
    iconID: "blur-on",
    operationID: "blur"
  }]
};

function OperationSelection() {
  //
  const {
    allowedTransformOperations,
    allowedAdjustmentOperations
  } = (0, React.useContext)(_.EditorContext);
  const isTransformOnly = allowedTransformOperations && !allowedAdjustmentOperations;
  const isAdjustmentOnly = allowedAdjustmentOperations && !allowedTransformOperations;
  const [selectedOperationGroup, setSelectedOperationGroup] = React.useState(isAdjustmentOnly ? "adjust" : "transform");
  const [, setEditingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState);
  const filteredOperations = (0, React.useMemo)(() => {
    // If neither are specified then allow the full range of operations
    if (!allowedTransformOperations && !allowedAdjustmentOperations) {
      return operations;
    }

    const filteredTransforms = allowedTransformOperations ? operations.transform.filter(op => allowedTransformOperations.includes(op.operationID)) : operations.transform;
    const filteredAdjustments = allowedAdjustmentOperations ? operations.adjust.filter(op => allowedAdjustmentOperations.includes(op.operationID)) : operations.adjust;

    if (isTransformOnly) {
      return {
        transform: filteredTransforms,
        adjust: []
      };
    }

    if (isAdjustmentOnly) {
      return {
        adjust: filteredAdjustments,
        transform: []
      };
    }

    return {
      transform: filteredTransforms,
      adjust: filteredAdjustments
    };
  }, [allowedTransformOperations, allowedAdjustmentOperations, isTransformOnly, isAdjustmentOnly]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_reactNative.ScrollView, {
    style: styles.opRow,
    horizontal: true
  }, //@ts-ignore
  filteredOperations[selectedOperationGroup].map((item, index) => /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.opContainer,
    key: item.title
  }, /*#__PURE__*/React.createElement(_IconButton.IconButton, {
    text: item.title,
    iconID: item.iconID,
    onPress: () => setEditingMode(item.operationID)
  })))), !isTransformOnly && !isAdjustmentOnly ? /*#__PURE__*/React.createElement(_reactNative.View, {
    style: styles.modeRow
  }, /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modeButton, selectedOperationGroup === "transform" && {
      backgroundColor: "#333"
    }],
    onPress: () => setSelectedOperationGroup("transform")
  }, /*#__PURE__*/React.createElement(_Icon.Icon, {
    iconID: "transform",
    text: "Transform"
  })), /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
    style: [styles.modeButton, selectedOperationGroup === "adjust" && {
      backgroundColor: "#333"
    }],
    onPress: () => setSelectedOperationGroup("adjust")
  }, /*#__PURE__*/React.createElement(_Icon.Icon, {
    iconID: "tune",
    text: "Adjust"
  }))) : null);
}

const styles = _reactNative.StyleSheet.create({
  opRow: {
    height: 80,
    width: "100%",
    backgroundColor: "#333"
  },
  opContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16
  },
  modeRow: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  modeButton: {
    height: 80,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222"
  }
});
//# sourceMappingURL=OperationSelection.js.map