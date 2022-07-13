import type { RouteLike } from "../core/RequestManager";
import { Character } from "../structures/Character";
import { Episode } from "../structures/Episode";

export const Routes: {[key: string]: ((args: any) => RouteLike)} = {
	character: (id: number) => `/character/${id}`,
	characters: (ids: number[]) => `/character/${ids.join(",")}`,
	allCharacters: () => `/character`,
	location: (id: number) => `/location/${id}`,
	locations: (ids: number[]) => `/location/${ids.join(",")}`,
	allLocations: () => `/location`,
	allEpisodes: () => `/episode`,
	episode: (id: number) => `/episode/${id}`,
	episodes: (ids: number[]) => `/episode/${ids.join(",")}`,
};

export const RoutesReturnType: {[key: keyof typeof Routes]: any} = {
	character: Character,
	characters: [Character],
	allCharacters: [Character],
	location: Object,
	locations: [Object],
	allLocations: [Object],
	episode: Episode,
	episodes: [Episode],
	allEpisodes: [Episode]
}

export const enum RequestMethod {
	Delete = "delete",
	Get = "get",
	Patch = "patch",
	Post = "post",
	Put = "put",
}
