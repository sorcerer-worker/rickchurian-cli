import { EpisodeManager } from "../manager/EpisodeManager";

const manager = new EpisodeManager();

export default { execute: (options?: any) => {
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