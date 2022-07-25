import { CharacterManager } from "../manager/CharacterManager";
import { Command, CommandOptionType, ResolvedCommandOptions } from "../structures";

const manager = new CharacterManager();

export class CharacterCommand extends Command {
    constructor() {
        super({
            name: "character",
            options: [
                {
                    name: "name",
                    type: CommandOptionType.String,
                    valueName: "name",
                },
                {
                    name: "all",
                    type: CommandOptionType.Boolean,
                    description: "Whether to fetch all characters.",
                },
            ],
        });
    }

    execute(args: ResolvedCommandOptions) {
        const { options } = args;

        manager
            .fetchAll({ filter: { name: options.name } })
            .then((result) => {
                console.log(options.all)
                result = options.all ? result : result.slice(0, 10);
                // original result : limit 10
                result.forEach((char) => {
                    console.log(`
${char.name}
specimen_id: ${char.id}
status: ${char.status}
gender: ${char.gender}
species: ${char.species}
seen_in: episodes: ${char.episodes}`);
                });
            })
            .catch(() => {
                console.log("Specimen not found in our archive.");
            });
    }
}