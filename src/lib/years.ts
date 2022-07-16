import years from "../seed/years.json";

export type Years = {
    [key: string]: {
        [key: string]: any,
        falseYear: boolean
    }
}

export const yearArr: Array<string> = Object.keys(years.current)

const currentYears: Years = { ...years.current };
// note: subject to update through wikipedia api for automatically checking the years associated
export default { execute: () => {
    console.log(`${yearArr.length - years.falseYears} Years of Rick and Morty, Currently:`)
    yearArr
        .forEach((yearItem: string) => {
            if (!currentYears[yearItem]["falseYear"]) {
                console.log(yearItem)
            }
        })
    }
}