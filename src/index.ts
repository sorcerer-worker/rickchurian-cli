import { createCommand } from "commander";

import { setup } from "./lib";

const program = createCommand();

program
    .name('rickchurian')
    .option("--all", "see all results from any search queries")
    .option("--char, --character [character]","search by name or view a list of characters currently logged")
    .option("--loc, --location [location]","search by name or view a list of locations currently logged")
    .option("--ep, --episode [episode]","search by name or view a list of episodes currently logged")
    .option("--seasons","see a list of all seasons currently logged")
    .option("--years","see a list of all years R&M has existed currently logged")

program.parse()

const options = program.opts(); // returns options dict

setup(options)  // lib/index.ts adding additional setup for commands
