import { defineCommand, runMain as _runMain } from "citty";
import { name, description, version } from "../package.json";

export const main = defineCommand({
  meta: {
    name,
    description,
    version,
  },
  subCommands: {
    dev: () => import("./cli_dev").then((r) => r.default),
    build: () => import("./cli_build").then((r) => r.default),
  },
});

export const runMain = () => _runMain(main);
