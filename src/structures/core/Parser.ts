import { Argument, Command, InvalidOptionArgumentError, Option } from "commander";
import {
	Command as CLICommand,
	CommandOptionType,
	JSONCommandAgrument,
	JSONCommandOption,
} from "./Command";
import partition from "lodash.partition";
import merge from "lodash.merge";
import { Validator } from "./Validator";
import { preventNegative } from "../../utils/utils";
import { ValidationError } from "../errors/ValidationError";

type ParsedCommand = ReturnType<CLICommand["parse"]>;
type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export class Parser {
	private command = new Command();
	private data: ParsedCommand;

	constructor(data: CLICommand | ParsedCommand) {
		if (data instanceof CLICommand) {
			data = data.parse();
		}

		this.data = data;
	}

	private DefaultOptionPrefix = "--";

	private NonProcessingField = ["name", "description", "aliases"];

	parseCommand(_target?: Command) {
		const commandData = Object.entries(this.data) as Entries<ParsedCommand>;

		for (const [name, value] of commandData) {
			if (this.NonProcessingField.includes(name)) {
				const func = Reflect.get(this.command, name);

				Reflect.apply(func, this.command, [value]);
				continue;
			}

			switch (name) {
				case "arguments":
					const args = this.parseArguments();
					this.addMultiple(this.command.addArgument, args, this.command);
					break;
				case "action":
					const fn = this.parseAction();
					this.command.action(fn);
					break;
				case "options":
					const options = this.parseOptions()
					this.addMultiple(this.command.addOption, options, this.command)
					break
				case "subcommands":
					const subcommands = this.parseSubcommands()
					this.addMultiple(this.command.addCommand, subcommands, this.command)
					break
			}
		}

		return this.command;
	}

	parseSubcommands() {
		return this.data.subcommands.map((i) => new Parser(i).parseCommand());
	}

	parseOptionValue(target: JSONCommandOption) {
		const { type, valueName, required } = target;
		if (!valueName) return undefined
		
		let parsedValue = "";

		switch (type) {
			case CommandOptionType.Number:
			case CommandOptionType.String:
			case CommandOptionType.Integer:
				parsedValue = valueName;
				break;
			case CommandOptionType.Variadic:
				parsedValue = `${valueName}...`;
		}

		if (parsedValue.length) {
			parsedValue = required ? `<${parsedValue}>` : `[${parsedValue}]`;
		}

		return `${parsedValue}`;
	}

	parseArgumentParser(target: JSONCommandOption) {
		const { type } = target;

		return this.Parser[type as keyof typeof this.Parser] 
	}

	private Parser = {
		number: (value: string | undefined) => {
			if (!value) return

			const result = this.ValidationRegex.Number.test(value);
			if (!result) throw new InvalidOptionArgumentError("Not a number.");
			return parseFloat(value);
		},

		integer: (value: string | undefined) => {
			if (!value) return;

			const result = this.ValidationRegex.Integer.test(value);
			if (!result) throw new InvalidOptionArgumentError("Not a integer.");
			return Number(value);
		},
	} as const;

	parseOptions() {
		return this.data.options.map((option) => {
			const {
				description,
				default: defaultOption,
				choices = [],
				conflictWith = [],
				required,
			} = option;

			const name = this.parseOptionName(option)
			const valueName = this.parseOptionValue(option)
			const parser = this.parseArgumentParser(option)

			const constructed = new Option(`${name} ${valueName}`, description);
			
			if (defaultOption) {
				const { value, description, isPreset } = defaultOption;
				constructed.default(value, description);
				if (isPreset) constructed.preset(value);
			}
			if (choices.length) constructed.choices(choices);
			if (conflictWith.length) constructed.conflicts(conflictWith);
			if (required) constructed.makeOptionMandatory(required);
			if (parser) constructed.argParser(parser)

			return constructed
		});
	}

	parseOptionName(option: JSONCommandOption) {
		const { prefix, name } = option;
		const optionPrefix = prefix ?? this.DefaultOptionPrefix;

		if (typeof name === "string") {
			return `${optionPrefix}${name}`;
		} else {
			return name
				.map((i) => {
					return `${i.prefix ?? optionPrefix}${i.name}`;
				})
				.join(", ");
		}
	}

	/**
	 * Returns an array of {@link Argument} from a Command.
	 */
	parseArguments() {
		this.validateArgumentsOrOptions(this.data.arguments);
		return this.data.arguments.map((i) => {
			const { name, choices, description, required } = i;
			const argName = required ? `<${name}>` : `[${name}]`;

			const constructed = new Argument(argName, description);

			if (choices) constructed.choices(choices);
			constructed[required ? "argRequired" : "argOptional"]();

			return constructed;
		});
	}

	/**
	 * Returns a wrapper function to parse arguments for easier accessing.
	 */
	parseAction() {
		return (...args: any[]) => {
			// Remove the appending command object.
			args = args.filter((i) => !(i instanceof Command));

			let [options, commandArguments] = partition(args, (i) => typeof i === "object");

			commandArguments = merge(
				commandArguments.map((i, index) => ({
					[`${this.data.arguments[index].name}`]: i,
				}))
			).at(0);
			options = options.at(0);

			return this.data.action({
				arguments: commandArguments,
				options,
			});
		};
	}

	private addMultiple(fn: Function, args: any[], thisValue?: any) {
		if (thisValue) fn = fn.bind(thisValue);
		args.map((i) => fn(i));
	}

	private ValidationRegex = {
		Number: /^[+-]?\d+(\.\d+)?$/,
		Integer: /^[+-]?\d+$/,
		Whitespace: /\s+/g,
	};

	private validateArgumentsOrOptions(objs: JSONCommandAgrument[] | JSONCommandOption[]) {
		const mapped = objs.map((i) => i.name);

		// Arguments must have unique name.
		Validator.validateUnique(mapped);

		// Argument name must not have whitespace.
		mapped.map((i) =>
			Validator.invert(Validator.validateValue, [i, this.ValidationRegex.Whitespace])
		);

		// Required arguments must be listed before optional arguments.
		const expectedRequiredOptionsSize = preventNegative(
			objs.map((i) => i.required).filter(Boolean).length - 1
		);
		objs.map((i, index) => {
			if (i.required && (index <= 0 || index > expectedRequiredOptionsSize))
				throw new ValidationError("Required arguments must be listed before optional arguments.");
		});
	}
}
