import { Connector, Shape } from "@mirohq/websdk-types";

const colors = ["#86b8ff", "#aca3ff", "#cdff79", "#fe8080"];

async function createShapeWithShadow(props: {
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  shadowSize?: number;
}) {
  const { shadowSize = 10 } = props;
  const shapeItem = await miro.board.createShape({
    content: props.content,
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    style: {
      borderOpacity: 1,
      fillColor: props.color,
    },
  });

  const shadowShape = await miro.board.createShape({
    x: shapeItem.x + shadowSize,
    y: shapeItem.y + shadowSize,
    width: shapeItem.width,
    height: shapeItem.height,
    style: {
      fillColor: "#2d2e33",
    },
  });

  await miro.board.sendBehindOf(shadowShape, shapeItem);

  return [shapeItem, shadowShape];
}

async function createActor(
  actor: any,
  x: number,
  y: number,
  messagesAmount: number,
  color: string = colors[Math.floor(Math.random() * colors.length)]
): Promise<[Shape, Shape, Shape, Shape, Connector]> {
  const [actorTop, shadowTop] = await createShapeWithShadow({
    content: actor.name,
    x,
    y,
    width: 150,
    height: 80,
    color,
  });

  const [actorBottom, shadowBottom] = await createShapeWithShadow({
    content: actor.name,
    x,
    y: y + 80 * (messagesAmount + 1),
    width: 150,
    height: 80,
    color,
  });

  const connector = await miro.board.createConnector({
    start: {
      item: actorTop.id,
    },
    end: {
      item: actorBottom.id,
    },
    style: {
      strokeStyle: "dashed",
      endStrokeCap: "none",
      startStrokeCap: "none",
      strokeWidth: 3,
    },
  });

  return [actorTop, shadowTop, actorBottom, shadowBottom, connector];
}

export const drawSequenceDiagram = async (props: {
  data: any;
  x?: number;
  y?: number;
}) => {
  const { data, x, y } = props;
  // SequenceDiagram;
  console.log(data);
  console.log("getActors", data.getActors?.());
  console.log("getConfig", data.getConfig?.());
  console.log("getCreatedActors", data.getCreatedActors?.());
  console.log("showSequenceNumbers", data.showSequenceNumbers?.());
  console.log("getDestroyedActors", data.getDestroyedActors?.());
  console.log("getDiagramTitle", data.getDiagramTitle?.());
  console.log("getBoxes", data.getBoxes?.());
  console.log("getMessages", data.getMessages?.());

  const actors = data.getActors();
  const messages = data.getMessages();

  let currentActor = Object.values(actors).find(
    (actor: any) => !actor.prevActor
  ) as any;

  let currentX = x ?? 0;
  let currentY = y ?? 0;

  const actorsCoords = new Map<string, { x: number; y: number }>();

  const allItems: (Shape | Connector)[] = [];
  const color = colors[Math.floor(Math.random() * colors.length)];

  while (currentActor) {
    const items = await createActor(
      currentActor,
      currentX,
      currentY,
      messages.filter((message: any) => typeof message.from === "string")
        .length,
      color
    );
    const [actor] = items;
    actorsCoords.set(currentActor.name, { x: actor.x, y: actor.y });
    currentActor = actors[currentActor.nextActor];
    currentX += 300;

    allItems.push(...items);
  }

  let index = 0;
  let activationBoxesTop: number[] = [];
  let prev: Shape[] = [];
  let connectors = [];

  for (const message of messages) {
    if (typeof message.from === "string") {
      const from = actorsCoords.get(message.from);
      const to = actorsCoords.get(message.to);
      const connector = await miro.board.createConnector({
        captions: [{ content: message.message }],
        start: {
          position: { x: from?.x ?? 0, y: (from?.y ?? 0) + 80 * (index + 1) },
        },
        end: {
          position: { x: to?.x ?? 0, y: (to?.y ?? 0) + 80 * (index + 1) },
        },
        style: { endStrokeCap: "filled_triangle", strokeWidth: 2 },
      });

      allItems.push(connector);
      connectors.push(connector);
      index++;
    } else if (message.type === 17) {
      const from = actorsCoords.get(message.from.actor);
      activationBoxesTop.push((from?.y ?? 0) + 80 * index);
    } else if (message.type === 18) {
      const top = activationBoxesTop.pop();
      const from = actorsCoords.get(message.from.actor);
      const height = (from?.y ?? 0) + 80 * index - (top ?? 0);
      const activator = await createShapeWithShadow({
        content: "",
        x: (from?.x ?? 0) + 5 * activationBoxesTop.length,
        y: (top ?? 0) + height / 2,
        width: 20,
        height,
        color,
        shadowSize: 3,
      });
      const last = prev[prev.length - 1];
      if (last) {
        await miro.board.sendBehindOf(activator, last);
      } else {
        await miro.board.sendBehindOf(activator, connectors[0] as any);
      }

      allItems.push(...activator);
      prev.push(...activator);

      if (activationBoxesTop.length === 0) {
        prev = [];
      }
    }
  }

  await miro.board.viewport.zoomTo(allItems);
  return miro.board.group({ items: allItems });
};

// const types = {
//   0: "-",
// };

// SOLID: 0,
//   DOTTED: 1,
//   NOTE: 2,
//   SOLID_CROSS: 3,
//   DOTTED_CROSS: 4,
//   SOLID_OPEN: 5,
//   DOTTED_OPEN: 6,
//   LOOP_START: 10,
//   LOOP_END: 11,
//   ALT_START: 12,
//   ALT_ELSE: 13,
//   ALT_END: 14,
//   OPT_START: 15,
//   OPT_END: 16,
//   ACTIVE_START: 17,
//   ACTIVE_END: 18,
//   PAR_START: 19,
//   PAR_AND: 20,
//   PAR_END: 21,
//   RECT_START: 22,
//   RECT_END: 23,
//   SOLID_POINT: 24,
//   DOTTED_POINT: 25,

// ->	Solid line without arrow
// -->	Dotted line without arrow
// ->>	Solid line with arrowhead
// -->>	Dotted line with arrowhead
// -x	Solid line with a cross at the end
// --x	Dotted line with a cross at the end.
// -)	Solid line with an open arrow at the end (async)
// --)	Dotted line with a open arrow at the end (async)
