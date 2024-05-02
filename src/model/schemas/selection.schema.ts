import { FunctionCallSchema } from "../types/ai";

export const getSelectionSchema: FunctionCallSchema = {
  name: "getSelection",
  description:
    "Function to get currently selected by user content on the board (all selected items)",
  input_schema: { type: "object" },
};

export const selectSchema: FunctionCallSchema = {
  name: "select",
  description:
    "Function to select items on the board. If you use id but do not know it, use the get function to get the information about items including ids",
  input_schema: {
    type: "object",
    properties: {
      id: {
        type: "array",
        items: {
          type: "string",
        },
      },
      type: {
        type: "array",
        enum: ["shape", "text", "sticky_note"],
      },
    },
  },
};

export const deselectSchema: FunctionCallSchema = {
  name: "deselect",
  description:
    "Function to deselect items on the board. If you use id but do not know it, use the get function to get the information about items including ids",
  input_schema: {
    type: "object",
    properties: {
      id: {
        type: "array",
        items: {
          type: "string",
          properties: {},
        },
      },
      type: {
        type: "array",
        enum: ["shape", "text", "sticky_note"],
      },
    },
  },
};
