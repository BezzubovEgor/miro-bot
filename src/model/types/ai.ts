import { JSONSchema } from "./jsonSchema";

export type AITextMessage = {
  type: "text";
  text: string;
  file?: Uint8Array;
};

export type AIFunctionResponseMessage = {
  type: "function_response";
  functionResponses: {
    id: string;
    name: string;
    isError?: boolean;
    response: {
      name: string;
      content: unknown;
    };
  }[];
};

export type AIRequest = AITextMessage | AIFunctionResponseMessage;

export type FunctionCall = {
  id: string;
  name: string;
  args: object;
};

export type TextResponse = {
  type: "text";
  text: string;
};

export type FunctionalCallResponse = {
  type: "function_call";
  calls: FunctionCall[];
};

export type EmptyResponse = {
  type: "empty";
};

export type AIResponse = TextResponse | FunctionalCallResponse | EmptyResponse;

export type FunctionCallSchema = {
  name: string;
  description: string;
  input_schema: JSONSchema<"object">;
};
