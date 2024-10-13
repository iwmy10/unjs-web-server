import { defineCommand } from "citty";
import { build } from "unbuild";

export default defineCommand({
  meta: {
    name: "build",
    description: "Build the project",
  },
  args: {
    entry: {
      type: "positional",
      description: "entry file (./app.ts)",
      required: true,
    },
  },
  async run({ args }) {},
});
