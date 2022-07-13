export class Episode {
	constructor(rawData: APIEpisode) {
		this._patch(rawData)
	}

	private EpisodeSeasonParseRegex = /^S([0-9]+)|E([0-9]+)$/gi

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
			const [ss, ep] = (data.episode.match(this.EpisodeSeasonParseRegex) ?? []).map(parseInt)

			this.season = ss
			this.episode = ep
		}

		if ('url' in data) {
			this.url = data.url
		}
	}

	get airTimestamp() {
		return this.airDate.getTime()
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
	 * The date that this epsiode was aired on
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
	 * The API URL of this episode
	 */
	url: string
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
