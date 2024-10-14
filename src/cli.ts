import { defineCommand, runMain as _runMain } from "citty";
import { name, description, version } from "../package.json";
import { listen } from "./listen";
import { createJiti } from "jiti";

export const main = defineCommand({
  meta: {
    name,
    description,
    version,
  },
  args: {
    entry: {
      type: "positional",
      description: "entry file (./app.ts)",
      required: true,
    },
  },
  async run({ args }) {
    // ユーザーの指定したエントリーファイルを読み込む
    const jiti = createJiti(process.cwd(), {
      cache: true,
      requireCache: false,
      interopDefault: true,
    });
    const app = (await jiti.import(args.entry)) as any;

    await listen({ app });
  },
});

export const runMain = () => _runMain(main);
