import { defineCommand, runMain as _runMain } from "citty";
import { name, description, version } from "../package.json";
import { listen } from "./listen";

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
    await listen(args);
  },
});

export const runMain = () => _runMain(main);
