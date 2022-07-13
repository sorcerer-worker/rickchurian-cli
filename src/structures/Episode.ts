import { CharacterManager } from "../manager/CharacterManager"
import { getIdFromURL } from "../utils/utils"

export class Episode {
	constructor(rawData: APIEpisode) {
		this._patch(rawData)
	}

	#EpisodeSeasonParseRegex = /^S([0-9]+)|E([0-9]+)$/gi
	#CharacterRequester = new CharacterManager()

	private _patch(data: APIEpisode) {
		if ('id' in data) {
			this.id = data.id
		}

		if ('name' in data) {
			this.name = data.name
		}

		if ('air_date' in data) {
			this.airDate = new Date(data.air_date)
		}

		if ('episode' in data) {

			const [ss, ep] = (data.episode.match(this.#EpisodeSeasonParseRegex) ?? []).map(i => parseInt(i.replace(/\D/g, '')))

			this.season = ss
			this.episode = ep
		}

		if ('url' in data) {
			this.url = data.url
		}

		if ('characters' in data) {
			this.characters = data.characters.map(getIdFromURL)
		}
	}

	get airTimestamp() {
		return this.airDate.getTime()
	}

	get code() {
		const [ss, ep] = [this.season, this.episode].map(i => String(i).padStart(2, '0'))
		return `S${ss}E${ep}`
	}

	public fetchCharacters() {
		return this.#CharacterRequester.fetch(this.characters)
	}
}

export interface Episode {
	/**
	 * The id of this episode
	 */
	id: number
	/**
	 * The name of this episode
	 */
	name: string
	/**
	 * The air date of the episode.
	 */
	airDate: Date
	airTimestamp: number
	
	/**
	 * The season that this epsiode belongs to
	 */
	season: number
	/**
	 * The number that this episode is labelled as in its season.
	 */
	episode: number
	/**
	 * Link to the episode's own endpoint.
	 */
	url: string
	/**
	 * List of characters who have been seen in the episode.
	 */
	characters: number[]
}

export interface APIEpisode {
	id: number;
	name: string;
	air_date: string;
	episode: EpisodeLike;
	characters: string[];
	url: string;
	created: string;
}

export type EpisodeLike = `S${number}E${number}`
