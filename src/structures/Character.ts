export class Character {
	constructor(rawCharacterData: APICharacter) {
		this._patch(rawCharacterData);
	}

	private _patch(data: APICharacter) {
		if ('id' in data) {
			this.id = data.id
		}

		if ('name' in data) {
			this.name = data.name
		}

		if ('status' in data) {
			this.status = data.status
		}

		if ('gender' in data) {
			this.gender = data.gender
		}
	}
}

export interface Character {
	id: number
	name: string
	status: CharacterStatus
	gender: CharacterGender
}

export interface APICharacter {
	id: number;
	name: string;
	status: CharacterStatus;
	species: string;
	type: string;
	gender: CharacterGender;
	origin: object;
	location: object;
	image: string;
	episode: string[];
	url: string;
	created: string;
}

export enum CharacterStatus {
	Dead = "Dead",
	Alive = "Alive",
	Unknown = "Unknown",
}

export enum CharacterGender {
	Female = "Female",
	Male = "Male",
	Genderless = "Genderless",
	Unknown = "Unknown",
}
