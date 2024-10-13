import { getPort } from "get-port-please";
import { createServer } from "node:http";
import { colors } from "consola/utils";
import { createJiti } from "jiti";

export async function listen({ entry }: { entry: string }) {
  // --- Resolve Options ---
  // --- Validate Options ---
  // --- Resolve Port ---
  const port = await getPort();
  // --- Listen ---

  // ユーザーの指定したエントリーファイルを読み込む
  const jiti = createJiti(process.cwd(), {
    cache: true,
    requireCache: false,
    interopDefault: true,
  });
  const app = (await jiti.import(entry)) as any;
  const handler = app.default._handle;

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
