import { defineCommand } from "citty";
import { build } from "./build";

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
  async run({ args }) {
    build({ entry: args.entry });
  },
});
