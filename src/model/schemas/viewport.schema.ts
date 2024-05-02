import { FunctionCallSchema } from "../types/ai";

export const zoomToSchema: FunctionCallSchema = {
  name: "zoomTo",
  description:
    "Function to zoom/go/navigate to the provided items on the board. If you use id but do not know it, use the get function to get the information about items including ids",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        description: "Array of item ids to navigate to.",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Id of item to navigate to.",
            },
          },
        },
      },
    },
  },
};

export const viewportSetSchema: FunctionCallSchema = {
  name: "viewportSet",
  description:
    "Function to set current user viewport. It can be used to navigate on the board without knowing the item ids.",
  input_schema: {
    type: "object",
    properties: {
      viewport: {
        type: "object",
        properties: {
          x: {
            type: "number",
            description:
              "Horizontal position of the top-left corner of the viewport, relative to the center point of the board, in dp",
            properties: {},
          },
          y: {
            type: "number",
            description:
              "Vertical position of the top-left corner of the viewport, relative to the center point of the board, in dp.",
            properties: {},
          },
          width: {
            type: "number",
            description: "Width of the viewport in dp",
            properties: {},
          },
          height: {
            type: "number",
            description: "Height of the viewport in dp",
            properties: {},
          },
        },
        required: ["x", "y", "width", "height"],
      },
    },
    required: ["viewport"],
  },
};

export const viewportGetSchema: FunctionCallSchema = {
  name: "viewportGet",
  description: "Function to get the current user viewport.",
  input_schema: {
    type: "object",
    properties: {},
  },
};
