import mermaid from "mermaid";

import { drawSequenceDiagram } from "./sequence";

mermaid.initialize({
  startOnLoad: false,
});

export const parseMermaidCode = async (props: {
  code: string;
  x?: number;
  y?: number;
}) => {
  const { code, x, y } = props;
  const diagram = await mermaid.mermaidAPI.getDiagramFromText(code);
  const data = diagram.getParser().parser.yy as any;
  switch (diagram.type) {
    case "sequence":
      return drawSequenceDiagram({ data, x, y });
  }

  throw new Error(`Can't create diagram of type ${diagram.type}`);
};

export const createMermaidDiagram = async (props: {
  code: string;
  x?: number;
  y?: number;
}) => {
  try {
    const diagram = await parseMermaidCode({
      code: props.code.replaceAll("\\\\n", "\n").replaceAll("\\n", "\n"),
      x: props.x,
      y: props.y,
    });
    return diagram;
  } catch (error) {
    console.error(error);
    return [];
  }
};
