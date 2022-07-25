import type { RouteLike } from "../core/RequestManager";
import { Character, Location, Episode } from "../structures";

export const Routes = {
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

export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Routes = { [key in keyof typeof Routes]: RoutesFunction };
export type RoutesFunction = (...args: any) => RouteLike;

export const KnownPossibleLocationType = [
	"Planet",
	"Cluster",
	"Space station",
	"Microverse",
	"TV",
	"Resort",
	"Fantasy town",
	"Dream",
	"Dimension",
	"unknown",
	"Menagerie",
	"Game",
	"Customs",
	"Daycare",
	"Dwarf planet (Celestial Dwarf)",
	"Miniverse",
	"Teenyverse",
	"Box",
	"Spacecraft",
	"Artificially generated world",
	"Machine",
	"Arcade",
	"Spa",
	"Quadrant",
	"Quasar",
	"Mount",
	"Liquid",
	"Convention",
	"Woods",
	"Diegesis",
	"Non-Diegetic Alternative Reality",
	"Nightmare",
	"Asteroid",
	"Acid Plant",
	"Reality",
	"Death Star",
	"Base",
	"Elemental Rings",
	"Human",
	"Space",
	"Hell",
	"Police Department",
	"Country",
	"Consciousness",
	"Memory",
] as const;

const KnownPossibleCharacterSpecies = [
	"Human",
	"Alien",
	"Humanoid",
	"unknown",
	"Poopybutthole",
	"Mythological Creature",
	"Animal",
	"Robot",
	"Cronenberg",
	"Disease",
] as const;

export type LocationType = ArrayElement<typeof KnownPossibleLocationType>;
export type CharacterSpeciesType = ArrayElement<typeof KnownPossibleCharacterSpecies>;

export const RoutesReturnType = {
	character: Character,
	characters: [Character],
	allCharacters: [Character],
	location: Location,
	locations: [Location],
	allLocations: [Location],
	episode: Episode,
	episodes: [Episode],
	allEpisodes: [Episode],
} as const;

export const enum RequestMethod {
	Delete = "delete",
	Get = "get",
	Patch = "patch",
	Post = "post",
	Put = "put",
}
