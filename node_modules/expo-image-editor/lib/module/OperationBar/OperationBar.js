import * as React from "react";
import { StyleSheet, View } from "react-native";
import { editingModeState } from "../Store";
import { useRecoilState } from "recoil";
import { OperationSelection } from "./OperationSelection";
import { Crop } from "./Crop";
import { Rotate } from "./Rotate";
import { Blur } from "./Blur";
export function OperationBar() {
  //
  const [editingMode] = useRecoilState(editingModeState);

  const getOperationWindow = () => {
    switch (editingMode) {
      case "crop":
        return /*#__PURE__*/React.createElement(Crop, null);

      case "rotate":
        return /*#__PURE__*/React.createElement(Rotate, null);

      case "blur":
        return /*#__PURE__*/React.createElement(Blur, null);

      default:
        return null;
    }
  };

  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(OperationSelection, null), editingMode !== "operation-select" && /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      position: "absolute"
    }]
  }, getOperationWindow()));
}
const styles = StyleSheet.create({
  container: {
    height: 160,
    width: "100%",
    backgroundColor: "#333",
    justifyContent: "center"
  }
});
//# sourceMappingURL=OperationBar.js.map