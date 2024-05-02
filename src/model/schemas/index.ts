import {
  createConnectorSchema,
  createShapeSchema,
  createStickyNoteSchema,
  createTextSchema,
  deselectSchema,
  getSchema,
  getSelectionSchema,
  groupSchema,
  prolongTimerSchema,
  removeSchema,
  resumeTimerSchema,
  selectSchema,
  startTimerSchema,
  stopTimerSchema,
  updateConnectorSchema,
  updateShapeSchema,
  updateStickyNoteSchema,
  updateTextSchema,
  viewportGetSchema,
  viewportSetSchema,
  zoomToSchema,
  drawChartOrDiagram,
} from ".";

export * from "./connectors.schema";
export * from "./get.schema";
export * from "./group.schema";
export * from "./remove.schema";
export * from "./selection.schema";
export * from "./shapes.schema";
export * from "./stickyNotes.schema";
export * from "./texts.schema";
export * from "./timer.schema";
export * from "./viewport.schema";
export * from "./mermaid.schema";

export const schemas = [
  createConnectorSchema,
  createShapeSchema,
  createStickyNoteSchema,
  createTextSchema,
  deselectSchema,
  getSchema,
  getSelectionSchema,
  groupSchema,
  prolongTimerSchema,
  removeSchema,
  resumeTimerSchema,
  selectSchema,
  startTimerSchema,
  stopTimerSchema,
  updateConnectorSchema,
  updateShapeSchema,
  updateStickyNoteSchema,
  updateTextSchema,
  viewportGetSchema,
  viewportSetSchema,
  zoomToSchema,
  drawChartOrDiagram,
];
