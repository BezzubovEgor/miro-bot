import { FunctionCallSchema } from "../types/ai";

export const groupSchema: FunctionCallSchema = {
  name: "group",
  description:
    "Function to group items on the board. If you use id but do not know it, use the get function to get the information about items including ids",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        description: "Array of item ids to create group from.",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Id of item to add to the group.",
            },
          },
        },
      },
    },
  },
};
