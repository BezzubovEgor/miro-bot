import { createMermaidDiagram } from "./mermaid";

async function forEach(
  payload: any,
  create: (item: unknown) => Promise<unknown>
) {
  const res = await Promise.all(
    payload.items.map(async (item: any) => create(item))
  );
  await miro.board.viewport.zoomTo(res);
  return res;
}

export const CommandsRegistry = new Map<
  string,
  (params: unknown) => Promise<unknown>
>()
  .set("createStickyNotes", async (payload: any) =>
    forEach(payload, (item: any) => {
      delete item.height;
      return miro.board.createStickyNote(item as any);
    })
  )
  .set("updateStickyNotes", async (payload: any) =>
    forEach(payload, async (item: any) => {
      delete item.height;
      const found = await miro.board.getById(item.id);
      const updated = Object.assign(found, item);
      await updated.sync();
      return updated;
    })
  )
  .set("createTexts", async (payload: any) =>
    forEach(payload, (item) => miro.board.createText(item as any))
  )
  .set("updateTexts", async (payload: any) =>
    forEach(payload, async (item: any) => {
      const found = await miro.board.getById(item.id);
      const updated = Object.assign(found, item);
      await updated.sync();
      return updated;
    })
  )
  .set("createShapes", async (payload: any) =>
    forEach(payload, (item) => miro.board.createShape(item as any))
  )
  .set("updateShapes", async (payload: any) =>
    forEach(payload, async (item: any) => {
      const found = await miro.board.getById(item.id);
      const updated = Object.assign(found, item);
      await updated.sync();
      return updated;
    })
  )
  .set("createConnectors", async (payload: any) =>
    forEach(payload, (item) => miro.board.createConnector(item as any))
  )
  .set("updateConnectors", async (payload: any) =>
    forEach(payload, async (item: any) => {
      const found = await miro.board.getById(item.id);
      const updated = Object.assign(found, item);
      await updated.sync();
      return updated;
    })
  )
  .set("get", async (params: unknown) => {
    const items = await miro.board.get(params as any);
    return items;
  })
  .set("remove", async (payload: any) =>
    Promise.all(
      payload.items.map(async (item: any) => miro.board.remove(item as any)) ??
        "success"
    ).catch(() => "success")
  )
  .set(
    "startTimer",
    async (payload: any) => await miro.board.timer.start(payload.duration)
  )
  .set("stopTimer", async (payload: any) => await miro.board.timer.stop())
  .set("resumeTimer", async (payload: any) => await miro.board.timer.resume())
  .set(
    "prolongTimer",
    async (payload: any) => await miro.board.timer.prolong(payload.duration)
  )
  .set("getSelection", async (payload: any) => {
    return await miro.board.getSelection();
  })
  .set(
    "select",
    async (payload: any) => (await miro.board.select(payload)) ?? "success"
  )
  .set(
    "deselect",
    async (payload: any) => (await miro.board.deselect(payload)) ?? "success"
  )
  .set("group", async (payload: any) => await miro.board.group(payload))
  .set(
    "zoomTo",
    async (payload: any) => await miro.board.viewport.zoomTo(payload.items)
  )
  .set(
    "viewportSet",
    async (payload: any) =>
      (await miro.board.viewport.set(payload)) ?? "success"
  )
  .set("viewportGet", async (payload: any) => await miro.board.viewport.get())
  .set("drawChartOrDiagram", async (payload: any) =>
    createMermaidDiagram(payload)
  );
