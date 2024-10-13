import { createApp } from "@iwmy10/unjs-web-server";

const app = createApp();

app.on("GET", "/", () => "Hello, World!");
app.on(
  "GET",
  "/:name",
  (ctx) => `Hello, ${ctx.params!.name}!\nquery: ${JSON.stringify(ctx.query)}`
);

export default app;
