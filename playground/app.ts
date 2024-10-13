import { createApp } from "@iwmy10/unjs-web-server";

const app = createApp();

app.on("GET", "/", () => "Hello, World!");
app.on("GET", "/:name", (params) => `Hello, ${params?.name}!`);

export default app;
