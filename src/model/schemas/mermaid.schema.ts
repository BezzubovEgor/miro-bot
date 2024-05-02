import { FunctionCallSchema } from "../types/ai";

export const drawChartOrDiagram: FunctionCallSchema = {
  name: "drawChartOrDiagram",
  description:
    "Lets you create diagrams and visualizations using text and code. It uses mermaid code as an input and returns list of created items on the board",
  input_schema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The mermaid code to create the diagram",
      },
      x: {
        type: "number",
        description: "The x coordinate of the top left corner of the diagram",
      },
      y: {
        type: "number",
        description: "The y coordinate of the top left corner of the diagram",
      },
    },
  },
};
