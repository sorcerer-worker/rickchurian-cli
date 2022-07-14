import type { Program } from ".";
import seasons from "../seed/seasons.json";

export type Seasons = {
    [key: string]: {
        [key: string]: any
    }
}

export const seasonArr: Array<string> = Object.keys(seasons.current)

export default { execute: (program: Program) => {
    program
        .command("seasons")
        .description("List readable seasons relevant to the show")
        .action(() => {
            console.log(`${seasonArr.length} Seasons of Rick and Morty, Currently:`)
            seasonArr
                .forEach((seasonItem: string) => {
                    console.log(seasonItem)
                })
        })
    }
}