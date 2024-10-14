import { getPort } from "get-port-please";
import { createServer } from "node:http";
import { colors } from "consola/utils";
import { App } from "./app";

export async function listen({ app }: { app: App }) {
  // --- Resolve Options ---
  // --- Validate Options ---
  // --- Resolve Port ---
  const port = await getPort();
  // --- Listen ---

  const handler = app._handle;

  let server = createServer(handler);

  const hostname = "localhost";
  server.listen(port, hostname);

  const label = colors.green(`  ➜ ${"Local:".padEnd(8, " ")} `);
  const url = colors.cyan(colors.underline(`http://${hostname}:${port}/`));
  console.log(label + url);
  // --- GetURL Utility ---
  // --- Close Utility ---
  // --- GetURLs Utility ---
}
