import years from "./years";


export type Program = {
    [key: string]: any
}

export type Command = {
    [key: string]: any,
    execute: ( program: Program ) => void
}

export const commands: Array<Command> = [ years ];

export default (program: Program) => {
    commands.forEach(command => {
        command.execute(program)
    })
}