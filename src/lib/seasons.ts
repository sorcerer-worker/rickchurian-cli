import seasons from "../seed/seasons.json";

export type Seasons = {
    [key: string]: {
        [key: string]: any
    }
}

export const seasonArr: Array<string> = Object.keys(seasons.current)
// note: subject to update through wikipedia api for automatically checking the seasons
export default { execute: (options?: any) => {
    console.log(`${seasonArr.length} Seasons of Rick and Morty, Currently:`)
    seasonArr
        .forEach((seasonItem: string) => {
            console.log(seasonItem)
        })
    }
}