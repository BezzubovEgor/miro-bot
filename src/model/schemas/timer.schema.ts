import { FunctionCallSchema } from "../types/ai";

export const startTimerSchema: FunctionCallSchema = {
  name: "startTimer",
  description: "Function to start a miro timer with specified duration",
  input_schema: {
    type: "object",
    properties: {
      duration: {
        type: "integer",
        description: "The duration of the timer in milliseconds",
      },
    },
  },
};

export const stopTimerSchema: FunctionCallSchema = {
  name: "stopTimer",
  description: "Function to stop a miro timer",
  input_schema: { type: "object" },
};

export const resumeTimerSchema: FunctionCallSchema = {
  name: "resumeTimer",
  description: "Function to resume a miro timer",
  input_schema: { type: "object" },
};

export const prolongTimerSchema: FunctionCallSchema = {
  name: "prolongTimer",
  description: "Function to prolong a miro timer with specified duration",
  input_schema: {
    type: "object",
    properties: {
      duration: {
        type: "integer",
        description: "The duration of the prolonging in milliseconds",
      },
    },
  },
};
