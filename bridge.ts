import { 
    createWebView, 
    postMessageSchema, 
    bridge
} from "@webview-bridge/react-native";
import { z } from "zod";

export const appPostMessageSchema = postMessageSchema({
  sendComplexityParams: {
    validate: z.object({
      current: z.string(),
      new: z.string(),
    }).parse,
  },
});

const appBridge = bridge({});

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appPostMessageSchema,
  debug: true, // <-- ADICIONE ESTA LINHA
});

export type AppPostMessageSchema = typeof appPostMessageSchema;
