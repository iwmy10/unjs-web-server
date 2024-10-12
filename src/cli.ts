import { defineCommand, runMain } from "citty";
import { name, description, version } from "../package.json";

export const main = defineCommand({
  meta: {
    name,
    description,
    version,
  },
  args: {
    name: {
      type: "positional",
    },
  },
  run({ args }) {
    console.log(`Hello, ${args.name}!`);
  },
});

runMain(main);
