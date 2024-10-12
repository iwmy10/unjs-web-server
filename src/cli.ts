import { defineCommand, runMain as _runMain } from "citty";
import { name, description, version } from "../package.json";
import { listen } from "./listen";

export const main = defineCommand({
  meta: {
    name,
    description,
    version,
  },
  args: {},
  async run({ args }) {
    await listen();
  },
});

export const runMain = () => _runMain(main);
