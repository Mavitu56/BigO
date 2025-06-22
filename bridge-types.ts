import { postMessageSchema } from "@webview-bridge/react-native";
import { z } from "zod";

// Recrie a mesma definição de schema que você tem no projeto React Native
// para garantir a segurança de tipos em ambos os lados.
export const appPostMessageSchema = postMessageSchema({
  sendComplexityParams: {
    validate: z.object({
      current: z.string(),
      new: z.string(),
    }).parse,
  },
});

// Exporte o tipo do schema para ser usado pelo linkBridge
export type AppPostMessageSchema = typeof appPostMessageSchema;