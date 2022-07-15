import years from "./years";
import seasons from "./seasons";
import character from "./character";
import episode from "./episode";
import location from "./location";

export const commands = {
    years,
    seasons,
    character,
    episode,
    location
}

export const setup = (options: any) => {
    if (options.years) {
        years.execute();
    }
    else if (options.seasons) {
        seasons.execute();
    }
    else if (options.character) {
        character.execute(options);
    }
    else if (options.episode) {
        episode.execute(options);
    }
    else if (options.location) {
        location.execute(options);
    }
}