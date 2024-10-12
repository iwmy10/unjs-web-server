import { defineCommand, runMain } from "citty";
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

runMain(main);
