import axios, { AxiosRequestConfig } from "axios";
import { RequestMethod } from "../constants";
export class RequestHandler {
	constructor(options: RequestHandlerOptions = {}) {
		this.options = options;
	}

    private get baseURL() {
        return this.options.baseURL ?? 'https://rickandmortyapi.com/api'
    }

    public get(options: Omit<InternalRequest, 'method'>) {
        return this.request({ ...options, method: RequestMethod.Get, route: options.route })
    }

	private async request(options: InternalRequest) {
		const { method, route } = options;

		const { data } = await axios[method](this.buildURL(route), {
			...options,
			baseURL: this.baseURL,
		});

		return data
	}

	private buildURL(route: RouteLike) {
		return this.baseURL + route;
	}
}

export interface InternalRequest extends Omit<AxiosRequestConfig, "method" | "baseURL"> {
	route: RouteLike;
	method: RequestMethod;
}

export type RouteLike = `/${string}`;

export interface RequestHandler {
	options: RequestHandlerOptions;
}

interface RequestHandlerOptions {
	baseURL?: string;
}
