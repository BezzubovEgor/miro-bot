import { FunctionCallSchema } from "../types/ai";

export const createStickyNoteSchema: FunctionCallSchema = {
  name: "createStickyNotes",
  description: "Create a sticky notes on a board.",
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
            shape: {
              type: "string",
              enum: ["square", "rectangle"],
            },
            x: {
              type: "number",
            },
            y: {
              type: "number",
            },
            style: {
              type: "object",
              properties: {
                textAlign: {
                  type: "string",
                  enum: ["left", "center", "right"],
                },
                fillColor: {
                  type: "string",
                  enum: [
                    "gray",
                    "light_yellow",
                    "yellow",
                    "orange",
                    "light_green",
                    "green",
                    "dark_green",
                    "cyan",
                    "light_pink",
                    "pink",
                    "violet",
                    "red",
                    "light_blue",
                    "blue",
                    "dark_blue",
                    "black",
                  ],
                },
                textAlignVertical: {
                  type: "string",
                  enum: ["top", "middle", "bottom"],
                },
              },
            },
            width: {
              type: "number",
              description: `Define either "width", or "height". It's not possible to change both properties at the same time.`,
            },
          },
        },
      },
    },
  },
};

export const updateStickyNoteSchema: FunctionCallSchema = {
  name: "updateStickyNotes",
  description: "Updates a sticky notes on a board.",
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
                "The id of the item to update on the board. If you do not know the id, use the get function to get the id of the item.",
            },
            content: {
              type: "string",
            },
            shape: {
              type: "string",
              enum: ["square", "rectangle"],
            },
            x: {
              type: "number",
            },
            y: {
              type: "number",
            },
            style: {
              type: "object",
              properties: {
                textAlign: {
                  type: "string",
                  enum: ["left", "center", "right"],
                },
                fillColor: {
                  type: "string",
                  enum: [
                    "gray",
                    "light_yellow",
                    "yellow",
                    "orange",
                    "light_green",
                    "green",
                    "dark_green",
                    "cyan",
                    "light_pink",
                    "pink",
                    "violet",
                    "red",
                    "light_blue",
                    "blue",
                    "dark_blue",
                    "black",
                  ],
                },
                textAlignVertical: {
                  type: "string",
                  enum: ["top", "middle", "bottom"],
                },
              },
            },
            width: {
              type: "number",
              description: `Define either "width", or "height". It's not possible to change both properties at the same time.`,
            },
          },
        },
      },
    },
  },
};
