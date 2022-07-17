//@ts-nocheck
import { Routes, RoutesReturnType } from "../constants";
import { RequestManager } from "../core/RequestManager";
import type { Episode, Location, Character } from "../structures/";

export class BaseManager<APIDataType> {
	private Requester = new RequestManager();

	protected async _fetch(options: { route: Function; params: number }): Promise<APIDataType>;
	protected async _fetch(options: { route: Function; params: number[] }): Promise<APIDataType[]>;
	protected async _fetch(options: FetchOptions) {
		const { params, route } = options;

		const Route = route(params);

        //@ts-expect-error
		const Structure = RoutesReturnType[route.name];

        const data = await this.Requester.get({ route: Route })

		if (Array.isArray(Structure)) {
			return data.map((i: any) => Reflect.construct(Structure[0], [i]));
		} else {
			return Reflect.construct(Structure, [data]);
		}
	}

    protected async _fetchMany(options: BaseFetchManyOptions) {

        let { page, type, all, filter } = options

        if (filter) filter = this.omitEmptyStringValue(filter)
        //@ts-expect-error
        const Route = Routes[`all${type.name}s`]()
        
        const data = await this.Requester.get({ route: Route, params: { ...filter, page } })

        const { info, results } = data
        if (all) {
            const pagesToFetch = Array.from(Array(info.pages + 1).keys()).filter(i => i && i !== this.determineCurrentPage(info))

            const additionalResults = await Promise.all(pagesToFetch.map(e => this.Requester.get({ route: Route, params: { ...filter, page: e } })))
            const transformed = additionalResults.map(({ results }) => results)

            return Array.prototype.concat.call([], results, transformed.flat()).map(i => Reflect.construct(type, [i]))
        }

        return results.map(i => Reflect.construct(type, [i]))
    }

    private omitEmptyStringValue(object: object): object {
        let result = {}
        for (const [key, value] of Object.entries(object)) {
            if (value.length > 0) Object.assign(result, { [`${key}`]: value })
        }

        return result
    }

    private determineCurrentPage(info: any) {
        if (!info.prev) return 1

        if (!info.next) return info.pages

        const url = new URL(info.prev).searchParams
        return Number(url.get('page') + 1)
    }
}

export interface BaseFetchManyOptions {
    /**
     * The page to paginate to
     */
    page?: number
    /**
     * Whether to fetch all regardless of pages. `page` option will be ignored if this is true
     * @default false
     */
    all?: boolean
    /**
     * Whether to include statistics returned by the api. Ignored if `all` option is used.
     * @default false
     */
    includesStatistics?: boolean
    type: Constructable<any>
    filter?: object
}

export interface FetchOptions {
	route: APIDataType['constructor'];
	params: number | number[];
}

export type APIDataType = Character | Episode | Location;

export type Constructable<T> = abstract new (...args: any[]) => T;
