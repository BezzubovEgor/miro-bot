import { FunctionCallSchema } from "../types/ai";

export const createShapeSchema: FunctionCallSchema = {
  name: "createShapes",
  description:
    "Creates a different types of shapes on a board. Can be used to draw something. If you need a title for a shape, place it as a content property.",
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
              description:
                "Content of the shape, text that will be displayed inside the shape",
            },
            groupId: {
              type: "string",
            },
            height: {
              type: "number",
              description:
                "Height of the shape in pixels, it should be greater than 8",
            },
            width: {
              type: "number",
              description:
                "Width of the shape in pixels, it should be greater than 8",
            },
            x: {
              type: "number",
            },
            y: {
              type: "number",
            },
            origin: {
              type: "string",
              enum: ["center"],
            },
            parentId: {
              type: "string",
            },
            relativeTo: {
              type: "string",
              enum: ["canvas_center", "parent_top_left", "parent_center"],
            },
            rotation: {
              type: "number",
            },
            shape: {
              type: "string",
              enum: [
                "rectangle",
                "round_rectangle",
                "circle",
                "triangle",
                "rhombus",
                "parallelogram",
                "trapezoid",
                "pentagon",
                "hexagon",
                "octagon",
                "wedge_round_rectangle_callout",
                "star",
                "flow_chart_predefined_process",
                "cloud",
                "cross",
                "can",
                "right_arrow",
                "left_arrow",
                "left_right_arrow",
                "left_brace",
                "right_brace",
              ],
            },
            style: {
              type: "object",
              properties: {
                borderColor: {
                  type: "string",
                  description: "HEX color in format of #RRGGBB",
                },
                borderOpacity: {
                  type: "number",
                },
                borderStyle: {
                  type: "string",
                  enum: ["normal", "dotted", "dashed"],
                },
                borderWidth: {
                  type: "number",
                },
                color: {
                  type: "string",
                  description:
                    "Hex value representing the color of the text string assigned to the the content property of the board item in format of #RRGGBB.",
                },
                fillColor: {
                  type: "string",
                  description:
                    "Hex value representing the color that fills the area of the text item in format of #RRGGBB",
                },
                fillOpacity: {
                  type: "number",
                },
                fontSize: {
                  type: "number",
                },
                textAlign: {
                  type: "string",
                  enum: ["left", "center", "right"],
                },
                textAlignVertical: {
                  type: "string",
                  enum: ["top", "middle", "bottom"],
                },
              },
            },
          },
        },
      },
    },
  },
};

export const updateShapeSchema: FunctionCallSchema = {
  name: "updateShapes",
  description:
    "Updates a different types of shapes on a board. Can be used to draw something. If you need a title for a shape, place it as a content property.",
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
                "Id of the shape to update, if you do not know id, use the get function to get the id of the item.",
            },
            content: {
              type: "string",
              description:
                "Content of the shape, text that will be displayed inside the shape",
            },
            groupId: {
              type: "string",
            },
            height: {
              type: "number",
              description:
                "Height of the shape in pixels, it should be greater than 8",
            },
            width: {
              type: "number",
              description:
                "Width of the shape in pixels, it should be greater than 8",
            },
            x: {
              type: "number",
              description:
                "Horizontal position of the center of the shape, relative to the center point of the board, in dp",
            },
            y: {
              type: "number",
              description:
                "Vertical position of the center of the shape, relative to the center point of the board, in dp",
            },
            origin: {
              type: "string",
              enum: ["center"],
            },
            parentId: {
              type: "string",
            },
            relativeTo: {
              type: "string",
              enum: ["canvas_center", "parent_top_left", "parent_center"],
            },
            rotation: {
              type: "number",
            },
            shape: {
              type: "string",
              enum: [
                "rectangle",
                "round_rectangle",
                "circle",
                "triangle",
                "rhombus",
                "parallelogram",
                "trapezoid",
                "pentagon",
                "hexagon",
                "octagon",
                "wedge_round_rectangle_callout",
                "star",
                "flow_chart_predefined_process",
                "cloud",
                "cross",
                "can",
                "right_arrow",
                "left_arrow",
                "left_right_arrow",
                "left_brace",
                "right_brace",
              ],
            },
            style: {
              type: "object",
              properties: {
                borderColor: {
                  type: "string",
                  description: "HEX color in format of #RRGGBB. It excepts only HEX color",
                },
                borderOpacity: {
                  type: "number",
                },
                borderStyle: {
                  type: "string",
                  enum: ["normal", "dotted", "dashed"],
                },
                borderWidth: {
                  type: "number",
                },
                color: {
                  type: "string",
                  description:
                    "Hex value representing the color of the text string assigned to the the content property of the board item in format of #RRGGBB. It excepts only HEX color",
                },
                fillColor: {
                  type: "string",
                  description:
                    "Hex value representing the color that fills the area of the text item in format of #RRGGBB. It excepts only HEX color",
                },
                fillOpacity: {
                  type: "number",
                },
                fontSize: {
                  type: "number",
                },
                textAlign: {
                  type: "string",
                  enum: ["left", "center", "right"],
                },
                textAlignVertical: {
                  type: "string",
                  enum: ["top", "middle", "bottom"],
                },
              },
            },
          },
        },
      },
    },
  },
};
