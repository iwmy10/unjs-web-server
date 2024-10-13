import { getPort } from "get-port-please";
import { createServer } from "node:http";
import { colors } from "consola/utils";

export async function listen() {
  // --- Resolve Options ---
  // --- Validate Options ---
  // --- Resolve Port ---
  const port = await getPort();
  // --- Listen ---
  let server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
  });

  const hostname = "localhost";
  server.listen(port, hostname);

  const label = colors.green(`  ➜ ${"Local:".padEnd(8, " ")} `);
  const url = colors.cyan(colors.underline(`http://${hostname}:${port}/`));
  console.log(label + url);
  // --- GetURL Utility ---
  // --- Close Utility ---
  // --- GetURLs Utility ---
}
