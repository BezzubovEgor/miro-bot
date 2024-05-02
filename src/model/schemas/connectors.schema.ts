import { FunctionCallSchema } from "../types/ai";

export const createConnectorSchema: FunctionCallSchema = {
  name: "createConnectors",
  description:
    "Creates connectors between a pair of items (you can use styles to create bidirectional connectors) on the board. Connectors can be used to show relationships between items and, for example, to create flowcharts and other diagrams.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            captions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description: "Text to display on the connector.",
                  },
                  position: {
                    type: "number",
                    description: "Position of the caption on the connector.",
                  },
                  textAlignVertical: {
                    type: "string",
                    description: "Vertical alignment of the caption.",
                    enum: ["top", "middle", "bottom"],
                  },
                },
              },
            },
            shape: {
              type: "string",
              description: "Type of the connector shape.",
              enum: ["straight", "elbowed", "curved"],
            },
            start: {
              type: "object",
              properties: {
                item: {
                  type: "string",
                  description:
                    "Id of start item to connect, if you do not know id, use get function.",
                },
              },
            },
            end: {
              type: "object",
              properties: {
                item: {
                  type: "string",
                  description:
                    "Id of end item to connect, if you do not know id, use get function.",
                },
              },
            },
            style: {
              type: "object",
              properties: {
                color: {
                  type: "string",
                  description:
                    "Color of the connector. It should have a hex format.",
                },
                endStrokeCap: {
                  type: "string",
                  description: "End of the connector.",
                  enum: [
                    "none",
                    "stealth",
                    "rounded_stealth",
                    "arrow",
                    "filled_triangle",
                  ],
                },
                fontSize: {
                  type: "number",
                  description: "Font size of the caption.",
                },
                startStrokeCap: {
                  type: "string",
                  description: "Start of the connector.",
                  enum: [
                    "none",
                    "stealth",
                    "rounded_stealth",
                    "arrow",
                    "filled_triangle",
                  ],
                },
                strokeColor: {
                  type: "string",
                  description: "Color of the connector stroke.",
                },
                strokeStyle: {
                  type: "string",
                  description: "Style of the connector stroke.",
                  enum: ["normal", "dotted", "dashed"],
                },
                strokeWidth: {
                  type: "number",
                  description: "Width of the connector stroke.",
                },
                textOrientation: {
                  type: "string",
                  description: "Orientation of the caption text.",
                  enum: ["horizontal", "aligned"],
                },
              },
            },
          },
          required: ["start", "end"],
        },
      },
    },
  },
};

export const updateConnectorSchema: FunctionCallSchema = {
  name: "updateConnectors",
  description:
    "Update connectors between a pair of items (you can use styles to create bidirectional connectors) on the board. Connectors can be used to show relationships between items and, for example, to create flowcharts and other diagrams.",
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
                "Id of the connector to update, if you do not know id, use get function to get the id of the item.",
            },
            captions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description: "Text to display on the connector.",
                  },
                  position: {
                    type: "number",
                    description: "Position of the caption on the connector.",
                  },
                  textAlignVertical: {
                    type: "string",
                    description: "Vertical alignment of the caption.",
                    enum: ["top", "middle", "bottom"],
                  },
                },
              },
            },
            shape: {
              type: "string",
              description: "Type of the connector shape.",
              enum: ["straight", "elbowed", "curved"],
            },
            start: {
              type: "object",
              properties: {
                item: {
                  type: "string",
                  description:
                    "Id of start item to connect, if you do not know id, use get function.",
                },
              },
            },
            end: {
              type: "object",
              properties: {
                item: {
                  type: "string",
                  description:
                    "Id of end item to connect, if you do not know id, use get function.",
                },
              },
            },
            style: {
              type: "object",
              properties: {
                color: {
                  type: "string",
                  description:
                    "Color of the connector. It should have a hex format.",
                },
                endStrokeCap: {
                  type: "string",
                  description: "End of the connector.",
                  enum: [
                    "none",
                    "stealth",
                    "rounded_stealth",
                    "arrow",
                    "filled_triangle",
                  ],
                },
                fontSize: {
                  type: "number",
                  description: "Font size of the caption.",
                },
                startStrokeCap: {
                  type: "string",
                  description: "Start of the connector.",
                  enum: [
                    "none",
                    "stealth",
                    "rounded_stealth",
                    "arrow",
                    "filled_triangle",
                  ],
                },
                strokeColor: {
                  type: "string",
                  description: "Color of the connector stroke.",
                },
                strokeStyle: {
                  type: "string",
                  description: "Style of the connector stroke.",
                  enum: ["normal", "dotted", "dashed"],
                },
                strokeWidth: {
                  type: "number",
                  description: "Width of the connector stroke.",
                },
                textOrientation: {
                  type: "string",
                  description: "Orientation of the caption text.",
                  enum: ["horizontal", "aligned"],
                },
              },
            },
          },
        },
      },
    },
  },
};
