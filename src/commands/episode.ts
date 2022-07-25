
import { EpisodeManager } from "../manager/EpisodeManager";
import { Command, CommandOptionType, ResolvedCommandOptions } from "../structures";

const manager = new EpisodeManager();

export class EpisodeCommand extends Command {
    constructor() {
        super({
            name: "episode",
            options: [
                {
                    name: "name",
                    type: CommandOptionType.String,
                    valueName: "name",
                },
                {
                    name: "all",
                    type: CommandOptionType.Boolean,
                    description: "Whether to fetch all episodes.",
                },
            ],
        });
    }

    execute(args: ResolvedCommandOptions) {
        const { options } = args;
    
        manager.fetchAll({filter: {name: options.episode}})
            .then(result => {
                result = options.all ?
                        result :
                        result.slice(0, 10);
                        // original result : limit 10
                result
                    .forEach( ep => {
                        console.log(`
    ${ep.name}
    air_date: ${ep.airDate}
    episode: ${ep.episode}
    characters: ${ep.characters}
    url: ${ep.url}
    created: ${ep.airTimestamp}`)
    
                    })
            })
            .catch(() => {
                console.log("Episode not found in our archive.")
            })
    }
}