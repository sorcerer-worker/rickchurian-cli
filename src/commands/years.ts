import YearsJson from "../seed/years.json";
import { Command, ResolvedCommandOptions } from "../structures";

type Years = {
    [key: string]: {
        [key: string]: any,
        falseYear: boolean
    }
}

const yearArr: Array<string> = Object.keys(YearsJson.current)
const currentYears: Years = { ...YearsJson.current };

export class YearsCommand extends Command {
    constructor() {
        super({
            name: "years",
            description: "shows all years"
        });
    }

    execute(args: ResolvedCommandOptions) {
        const { options } = args;
    
        try {
            // note: subject to update through wikipedia api for automatically checking the years associated
            console.log(`${yearArr.length - YearsJson.falseYears} Years of Rick and Morty, Currently:`)
            yearArr
                .forEach((yearItem: string) => {
                    if (!currentYears[yearItem]["falseYear"]) {
                        console.log(yearItem)
                    }
                })
            }
        catch {
            console.log("Options:")
            console.log(options)
            throw Error("Couldn't read years.json")
        }
    }
}