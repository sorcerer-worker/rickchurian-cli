import { LocationManager } from "../manager/LocationManager";
import { Command, CommandOptionType, ResolvedCommandOptions } from "../structures";

const manager = new LocationManager();

export class LocationCommand extends Command {
    constructor() {
        super({
            name: "location",
            options: [
                {
                    name: "name",
                    type: CommandOptionType.String,
                    valueName: "name",
                },
                {
                    name: "all",
                    type: CommandOptionType.Boolean,
                    description: "Whether to fetch all locations.",
                },
            ],
        });
    }

    execute(args: ResolvedCommandOptions) {
        const { options } = args;
    
        manager.fetchAll({filter: {name: options.location}})
        .then(result => {
            result = options.all ?
                    result :
                    result.slice(0, 10);
                    console.log(result.length)
                    // original result : limit 10
            result
                .forEach( l => {
                    console.log(`
${l.name}
location_id: ${l.id}
name: ${l.name}
type: ${l.type}
url: ${l.url}`)

                })
        })
        .catch(() => {
            console.log("Location not found in our archive.")
        })
    }
}