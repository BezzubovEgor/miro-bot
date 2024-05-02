import { FunctionCallSchema } from "../types/ai";

export const createTextSchema: FunctionCallSchema = {
  name: "createTexts",
  description: "Function to create text items on the board.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            content: {
              type: "string",
            },
            height: {
              type: "number",
            },
            rotation: {
              type: "number",
            },

            style: {
              type: "object",
              properties: {
                color: {
                  type: "string",
                },
                fillColor: {
                  type: "string",
                },
                fillOpacity: {
                  type: "string",
                },
                fontSize: {
                  type: "number",
                },
                textAlign: {
                  type: "string",
                  enum: ["left", "center", "right"],
                },
              },
            },
            width: {
              type: "number",
            },
            x: {
              type: "number",
            },
            y: {
              type: "number",
            },
          },
        },
      },
    },
  },
};

export const updateTextSchema: FunctionCallSchema = {
  name: "updateTexts",
  description: "Function to update text items on the board.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
              description:
                "Id of the text to update, if you do not know id, use the get function to get the id of the item.",
            },
            content: {
              type: "string",
            },
            height: {
              type: "number",
            },
            rotation: {
              type: "number",
            },

            style: {
              type: "object",
              properties: {
                color: {
                  type: "string",
                },
                fillColor: {
                  type: "string",
                },
                fillOpacity: {
                  type: "string",
                },
                fontSize: {
                  type: "number",
                },
                textAlign: {
                  type: "string",
                  enum: ["left", "center", "right"],
                },
              },
            },
            width: {
              type: "number",
            },
            x: {
              type: "number",
            },
            y: {
              type: "number",
            },
          },
        },
      },
    },
  },
};
