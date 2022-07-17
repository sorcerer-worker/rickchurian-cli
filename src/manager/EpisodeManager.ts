import { Routes } from "../constants";
import { APIEpisode, Episode } from "../structures/data/Episode";
import { BaseFetchManyOptions, BaseManager } from "./BaseManager";

export class EpisodeManager extends BaseManager<Episode> {

	/**
	 * Fetch one or multiple episode(s).
	 */
	public fetch(target: number): Promise<Episode>
	public fetch(target: number[]): Promise<Episode>[]
	public fetch(target: number | number[]): Promise<Episode> | Promise<Episode>[] {
		const route = Routes[Array.isArray(target) ? "locations" : "location"];
		//@ts-expect-error
		return super._fetch({ route, params: target });
	}

	/**
	 * Fetch all episodes.
	 * @param options {@link EpisodeFetchManyOptions}
	 */
	public fetchAll(options: EpisodeFetchManyOptions): Promise<Episode[]> {
		return super._fetchMany({ ...options, type: Episode });
	}
}

export interface EpisodeFilter extends Pick<APIEpisode, 'name' | 'episode'> {}

export interface EpisodeFetchManyOptions extends Omit<BaseFetchManyOptions, "type"> {
	filter?: Partial<EpisodeFilter>
}
