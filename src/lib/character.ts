import type { Program } from ".";

import { CharacterManager } from "../manager/CharacterManager";

const manager = new CharacterManager();

export default { execute: (program: Program) => {
    program
        .option("--char --character <name>","search for a particular character")
        .action((options: any) => {
            manager.fetchAll({filter: {name: options.character}})
                .then(result => {
                    result = options.all ?
                            result :
                            result.slice(0, 10);
                            // original result : limit 10
                    result
                        .forEach( char => {
                            console.log(`
${char.name}
specimen_id: ${char.id}
status: ${char.status}
gender: ${char.gender}
species: ${char.species}
seen_in: episodes: ${char.episodes}`)
                        })
                })
                .catch(() => {
                    console.log("Specimen not found in our archive.")
                })
        })
    }
}