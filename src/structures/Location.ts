import type { LocationType } from "../constants";
import { CharacterManager } from "../manager/CharacterManager";
import { getIdFromURL } from "../utils/utils";

export class Location {
	constructor(rawLocationData: APILocation) {
		this._patch(rawLocationData);
	}

	#Requester = new CharacterManager()

	private _patch(data: APILocation) {
		if ("id" in data) {
			this.id = data.id;
		}

		if ("name" in data) {
			this.name = data.name;
		}

		if ("type" in data) {
			this.type = !data.type.length ? 'unknown' : data.type;
		}

		if ("residents" in data) {
			this.residents = data.residents.map(getIdFromURL);
		}

		if ("url" in data) {
			this.url = data.url;
		}
	}

	public fetchResidents() {
		return this.#Requester.fetch(this.residents as number[])
	}
}

export interface Location {
	/**
	 * The id of the location.
	 */
	id: number;
	/**
	 * The name of the location.
	 */
	name: string;
	/**
	 * The type of the location.
	 */
	type: LocationType;
	/**
	 * List of character ids who have been last seen in the location.
	 */
	residents: number[];
	/**
	 * Link to the location's own endpoint.
	 */
	url: string;
}

export interface APILocation {
	id: number;
	name: string;
	type: LocationType;
	dimension: string;
	residents: string[];
	url: string;
	created: string;
}
