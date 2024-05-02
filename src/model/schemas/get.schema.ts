import { FunctionCallSchema } from "../types/ai";

export const getSchema: FunctionCallSchema = {
  name: "get",
  description:
    "Function to get/see/check content on the board. If you do not know context, use the get function to get the information about board.",
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
