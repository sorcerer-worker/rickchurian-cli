import SeasonsJson from "../seed/seasons.json";
import { Command, ResolvedCommandOptions } from "../structures";

// type Seasons = {
//     [key: string]: {
//         [key: string]: any
//     }
// }

const seasonArr: Array<string> = Object.keys(SeasonsJson.current)

export class SeasonsCommand extends Command {
    constructor() {
        super({
            name: "seasons",
            description: "shows all seasons"
        });
    }

    execute(args: ResolvedCommandOptions) {
        const { options } = args;
    
        try {
            // note: subject to update through wikipedia api for automatically checking the seasons
            console.log(`${seasonArr.length} Seasons of Rick and Morty, Currently:`)
            seasonArr
                .forEach((seasonItem: string) => {
                    console.log(seasonItem)
                })
            }
        catch {
            console.log("Options:")
            console.log(options)
            throw Error("Couldn't read seasons.json")
        }
    }
}