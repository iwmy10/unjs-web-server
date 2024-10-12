import { getPort } from "get-port-please";
import { createServer } from "node:http";

export async function listen() {
  // --- Resolve Options ---
  // --- Validate Options ---
  // --- Resolve Port ---
  const port = await getPort({
    port: 3000,
  });
  // --- Listen ---
  let server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World");
  });

  const hostname = "localhost";
  await server.listen(port, hostname);

  console.log(`Listening on http://${hostname}:${port}`);
  // --- GetURL Utility ---
  // --- Close Utility ---
  // --- GetURLs Utility ---
}
