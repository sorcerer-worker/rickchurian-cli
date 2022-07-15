import { LocationManager } from "../manager/LocationManager";

const manager = new LocationManager();

export default { execute: (options?: any) => {
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