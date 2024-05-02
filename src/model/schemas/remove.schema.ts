import { FunctionCallSchema } from "../types/ai";

export const removeSchema: FunctionCallSchema = {
  name: "remove",
  description:
    "Removes items with the given ids and types from the board, if you do not know id, use the get function to get the id of the item.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The id of the item to remove from the board",
            },
            type: {
              type: "string",
              description: "The type of the item to remove from the board",
              enum: ["shape", "text", "sticky_note"],
            },
          },
          required: ["id", "type"],
        },
      },
    },
  },
};
