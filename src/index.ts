import { createCommand } from "commander";

const program = createCommand();

program
    .name('rickchurian')
    .usage('[year]')

program.parse()