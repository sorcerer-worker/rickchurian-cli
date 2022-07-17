import { Routes } from "../constants";
import { APILocation, Location } from "../structures/";
import { BaseFetchManyOptions, BaseManager } from "./BaseManager";

export class LocationManager extends BaseManager<Location> {

	/**
	 * Fetch one or multiple location(s).
	 */
	public fetch(target: number): Promise<Location>
	public fetch(target: number[]): Promise<Location>[]
	public fetch(target: number | number[]): Promise<Location> | Promise<Location>[] {
		const route = Routes[Array.isArray(target) ? "locations" : "location"];
		//@ts-expect-error
		return super._fetch({ route, params: target });
	}

	/**
	 * Fetch all locations.
	 * @param options {@link EpisodeFetchManyOptions}
	 */
	public fetchAll(options: LocationFetchManyOptions): Promise<Location[]> {
		return super._fetchMany({ ...options, type: Location });
	}
}

export interface LocationFilter extends Pick<APILocation, 'name' | 'type' | 'dimension'> {}

export interface LocationFetchManyOptions extends Omit<BaseFetchManyOptions, "type"> {
	filter?: Partial<LocationFilter>
}
