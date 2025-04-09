"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readyState = exports.processingState = exports.imageScaleFactorState = exports.imageDataState = exports.imageBoundsState = exports.glProgramState = exports.glContextState = exports.editingModeState = exports.cropSizeState = exports.accumulatedPanState = void 0;

var _recoil = require("recoil");

const imageDataState = (0, _recoil.atom)({
  key: "imageDataState",
  default: {
    uri: "",
    width: 0,
    height: 0
  }
});
exports.imageDataState = imageDataState;
const imageScaleFactorState = (0, _recoil.atom)({
  key: "imageScaleFactorState",
  default: 1
});
exports.imageScaleFactorState = imageScaleFactorState;
const imageBoundsState = (0, _recoil.atom)({
  key: "imageBoundsState",
  default: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
});
exports.imageBoundsState = imageBoundsState;
const readyState = (0, _recoil.atom)({
  key: "readyState",
  default: false
});
exports.readyState = readyState;
const processingState = (0, _recoil.atom)({
  key: "processingState",
  default: false
});
exports.processingState = processingState;
const accumulatedPanState = (0, _recoil.atom)({
  key: "accumulatedPanState",
  default: {
    x: 0,
    y: 0
  }
});
exports.accumulatedPanState = accumulatedPanState;
const cropSizeState = (0, _recoil.atom)({
  key: "cropSizeState",
  default: {
    width: 0,
    height: 0
  }
});
exports.cropSizeState = cropSizeState;
const editingModeState = (0, _recoil.atom)({
  key: "editingModeState",
  default: "operation-select"
});
exports.editingModeState = editingModeState;
const glContextState = (0, _recoil.atom)({
  key: "glContextState",
  default: null
});
exports.glContextState = glContextState;
const glProgramState = (0, _recoil.atom)({
  key: "glProgramState",
  default: null
});
exports.glProgramState = glProgramState;
//# sourceMappingURL=Store.js.map