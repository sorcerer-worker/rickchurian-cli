import { createCommand } from "commander";

// cli commands
import setup from "./lib";

const program = createCommand();

program
    .name('rickchurian')
    .usage('[year]')

setup(program); // lib/index.ts adding additional commands
program.parse()