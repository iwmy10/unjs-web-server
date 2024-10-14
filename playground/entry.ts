import { createServer } from "http";
import app from "./app";
import { colors } from "consola/utils";
import { getPort } from "get-port-please";

async function main() {
  const handler = app._handle;

let server = createServer(handler);

const port = await getPort();

const hostname = "localhost";
server.listen(port, hostname);

const label = colors.green(`  ➜ ${"Local:".padEnd(8, " ")} `);
const url = colors.cyan(colors.underline(`http://${hostname}:${port}/`));
console.log(label + url);
}

main()