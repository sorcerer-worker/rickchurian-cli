import { inspect } from "node:util";

export class ValidationError extends Error {
	public override message: string = "";
	public expected: any;

	private append(value: string, space: boolean = true) {
		this.message = this.message + (space ? " " : "") + value;
	}

	expect(value: any) {
		this.append(`Expected '${inspect(value)}'`);
		return this;
	}

	match(arg: any, single: boolean = false) {
		this.append(`match${single ? "es" : ""} ${arg.constructor.name} ${arg}`);
		return this;
	}

	ofType(type: string) {
		this.append(`of type '${type}'`);
		return this;
	}

	custom(any: any) {
		this.append(any);
		return this;
	}

	get to() {
		this.append("to");
		return this;
	}

	beValue(value: any) {
		this.expected = value;
		this.append(`be '${value}'`);
		return this;
	}

	get be() {
		this.append("be");
		return this;
	}

	oneOf(arg: any[]) {
		this.append(`one of these values: ${arg.map((i) => `'${i}'`).join(", ")}`);
	}

	get not() {
		this.append("not");
		return this;
	}

	get end() {
		this.append(".", false);
		return this;
	}

	received(value: any) {
		this.append(`but received '${value}' instead`);
		return this;
	}
}
