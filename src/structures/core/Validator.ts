import { inspect } from "util";
import { isRegExp } from "util/types";
import { getProperty } from "../../utils/utils";
import { ValidationError } from "../errors/ValidationError";

export class Validator {
	static validateUnique(arg: any[], key?: string) {

		if (key) arg.map(i => getProperty(i, key))
		const expected = new Set(arg);

		if (expected.size !== arg.length)
			throw new ValidationError().expect(arg).to.be.custom("unique").end;

		return arg;
	}

	static invert(fn: Function, args: any[]) {

		let result;
		try {
			result = fn.apply(Validator, args) ?? true;
		} catch(err) {
			return args[0]
		}

		if (result) throw new ValidationError().expect(this.formatFunction(fn, args)).to.custom('throw an error').end
	}

	static validateValue(value: string, matcher: RegExp | string | string[]) {

		if (isRegExp(matcher)) {
			const result = matcher.test(value);
			if (!result) throw new ValidationError().expect(value).to.match(matcher).end;
		} else if (Array.isArray(matcher)) {
			if (!matcher.includes(value)) {
				throw new ValidationError().expect(value).to.be.oneOf(matcher);
			}
		} else {
			if (matcher !== value) {
				throw new ValidationError().expect(value).to.beValue(matcher);
			}
		}
	}

	static validateNonNullish(value: any): value is NonNullable<any> {
		if (!value)
			throw new ValidationError().expect("value").to.not.beValue(null).received(value).end;
		return value;
	}

	private static formatFunction(fn: Function, args: any[]) {
		return `${fn.name}(${args.map(i => inspect(i)).join(', ')})`
	}

	static validatePrimitiveType(value: string, constructor: Function) {
		const expected = constructor.name.toLowerCase();
		if (typeof value !== expected)
			throw new ValidationError().expect(value).to.be.ofType(expected).end;

		return value;
	}
}