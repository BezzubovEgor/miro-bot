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
