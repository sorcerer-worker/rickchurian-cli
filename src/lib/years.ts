import type { Program } from ".";
import years from "../seed/years.json";

export type Years = {
    [key: string]: {
        [key: string]: any,
        falseYear: boolean
    }
}

export const yearArr: Array<string> = Object.keys(years.current)

const currentYears: Years = { ...years.current };

export default { execute: (program: Program) => {
    program
        .command("year")
        .description("List readable years relevant to the show")
        .action(() => {
            console.log(`${yearArr.length - years.falseYears} Years of Rick and Morty, Currently:`)
            yearArr
                .forEach((yearItem: string) => {
                    if (!currentYears[yearItem]["falseYear"]) {
                        console.log(yearItem)
                    }
                })
        })
    }
}