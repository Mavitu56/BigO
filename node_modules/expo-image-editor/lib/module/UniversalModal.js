import React from "react";
import { Modal as RNModal, Platform } from "react-native"; //@ts-ignore

import WebModal from "modal-enhanced-react-native-web";
export const UniversalModal = props => {
  if (Platform.OS === "web") {
    return /*#__PURE__*/React.createElement(WebModal, {
      isVisible: props.visible,
      style: {
        margin: 0
      }
    }, props.children);
  }

  return /*#__PURE__*/React.createElement(RNModal, props);
};
//# sourceMappingURL=UniversalModal.js.map