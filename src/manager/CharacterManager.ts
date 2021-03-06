import { Routes } from "../constants";
import { APICharacter, Character } from "../structures/";
import { BaseFetchManyOptions, BaseManager } from "./BaseManager";

export class CharacterManager extends BaseManager<Character> {

	/**
	 * Fetch one or multiple character(s).
	 */
	public fetch(target: number): Promise<Character>
	public fetch(target: number[]): Promise<Character>[]
	public fetch(target: number | number[]): Promise<Character> | Promise<Character>[] {
		const route = Routes[Array.isArray(target) ? "characters" : "character"];
		//@ts-expect-error
		return super._fetch({ route, params: target });
	}
	
	/**
	 * Fetch all characters.
	 * @param options {@link CharacterFetchManyOptions}
	 */
	public fetchAll(options: CharacterFetchManyOptions): Promise<Character[]> {
		return super._fetchMany({ ...options, type: Character });
	}
}

export interface CharacterFilter extends Pick<APICharacter, 'gender' | 'type' | 'species' | 'status' | 'name'> {}

export interface CharacterFetchManyOptions extends Omit<BaseFetchManyOptions, "type"> {
	filter?: Partial<CharacterFilter>
}
