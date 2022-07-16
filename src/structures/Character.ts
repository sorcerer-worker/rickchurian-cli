import { EpisodeManager } from "../manager/EpisodeManager";
import { LocationManager } from "../manager/LocationManager";
import { getIdFromURL } from "../utils/utils";

export class Character {
	constructor(rawCharacterData: APICharacter) {
		this._patch(rawCharacterData);
	}

	#LocationRequester = new LocationManager();
	#EpisodeRequester = new EpisodeManager();

	private _patch(data: APICharacter) {
		if ("id" in data) {
			this.id = data.id;
		}

		if ("name" in data) {
			this.name = data.name;
		}

		if ("status" in data) {
			this.status = data.status;
		}

		if ("gender" in data) {
			this.gender = data.gender;
		}

		if ("episode" in data) {
			this.episodes = data.episode.map(getIdFromURL);
		}

		if ("image" in data) {
			this.imageURL = data.image;
		}

		if ("species" in data) {
			this.species = data.species;
		}

		if ("url" in data) {
			this.url = data.url;
		}

		if ("type" in data) {
			this.type = !data.type.length ? 'unknown' : data.type;
		}

		if ("origin" in data) {
			this.originId = data.origin.name === "unknown" ? null : getIdFromURL(data.origin.url);
		}

		if ("location" in data) {
			this.locationId = data.location.name === "unknown" ? null : getIdFromURL(data.location.url);
		}
	}

	/**
	 * Fetch the current location that this character is in.
	 */
	public async fetchLocation() {
		return this.locationId ? this.#LocationRequester.fetch(this.locationId) : null;
	}

	/**
	 * Fetch the origin location that this character comes from.
	 */
	public async fetchOrigin() {
		return this.originId ? this.#LocationRequester.fetch(this.originId) : null;
	}

	/**
	 * Fetch all episodes that this character appears on.
	 */
	public fetchEpisodes() {
		return this.#EpisodeRequester.fetch(this.episodes);
	}
}

export interface Character {
	/**
	 * The id of the character.
	 */
	id: number;
	/**
	 * The name of the character.
	 */
	name: string;
	/**
	 * The status of the character
	 * @type CharacterStatus
	 */
	status: CharacterStatus;
	/**
	 * The gender of the character.
	 * @type CharacterGender
	 */
	gender: CharacterGender;
	/**
	 * List of episodes in which this character appeared.
	 */
	episodes: number[];
	/**
	 * The species of the character.
	 */
	species: string;
	/**
	 * Link to the character's image. All images are 300x300px and most are medium shots or portraits since they are intended to be used as avatars.
	 */
	imageURL: string;
	/**
	 * Link to the character's own URL endpoint.
	 */
	url: string;
	/**
	 * The type or subspecies of the character.
	 */
	type: string;
	/**
	 * The ID of the character's origin location.
	 */
	originId: number | null;
	/**
	 * The ID of the character's last known location endpoint.
	 */
	locationId: number | null;
}

export interface APICharacter {
	id: number;
	name: string;
	status: CharacterStatus;
	species: string;
	type: string;
	gender: CharacterGender;
	origin: APICharacterLocation;
	location: APICharacterLocation;
	image: string;
	episode: string[];
	url: string;
	created: string;
}

type APICharacterLocation = {
	name: string | "unknown";
	url: string;
};

export enum CharacterStatus {
	Dead = "Dead",
	Alive = "Alive",
	Unknown = "Unknown",
}

export enum CharacterGender {
	Female = "Female",
	Male = "Male",
	Genderless = "Genderless",
	Unknown = "unknown",
}
