import years from "./years";
import seasons from "./seasons";
import character from "./character";
import episode from "./episode";
import location from "./location";


export type Program = {
    [key: string]: any
}

export type Command = {
    [key: string]: any,
    execute: ( program: Program ) => void
}

export const commands: Array<Command> = [
    years,
    seasons,
    character,
    episode,
    location
];

export default (program: Program) => {
    commands.forEach(command => {
        command.execute(program)
    })
}