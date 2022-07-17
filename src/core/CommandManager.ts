import { Argument, Command, InvalidOptionArgumentError, Option } from "commander";
import { glob } from "glob";
import { basename, join, resolve } from "node:path";
import { promisify } from "node:util";
import type { Constructable } from "../manager/BaseManager";
import {
	Command as CLICommand,
	CommandOptionType,
	JSONCommandAgrument,
	JSONCommandOption,
} from "../structures/";

const globPromise = promisify(glob);

export class CommandManager {
	public program: Command;

	constructor(program: Command) {
		this.program = program;
	}

	public register(cmd: CLICommand, target?: Command) {
		const parsed = cmd.parse();
		const data = Object.entries(parsed);

		const command = new Command();

		for (const [name, value] of data) {
			if (!Array.isArray(value)) {
				if (name !== "action") {
					//@ts-expect-error
					command[name](value);
				} else {
					command.action(function wrapper(...args: any[]) {
						// Remove the appending command object.
						args.length = args.length - 1;

						const parsedArguments = {};
						const argument = args
							.filter((i) => typeof i !== "object")
							.map((i, index) => ({ [`${parsed.arguments[index].name}`]: i }));

						argument.forEach((i) => {
							const [name, value] = Object.entries(i)[0];
							Object.assign(parsedArguments, { [`${name}`]: value });
						});

						const options = args.find((i) => typeof i === "object") ?? {};
						return cmd.execute({
							arguments: parsedArguments,
							options,
						});
					});
				}
			} else {
				if (name === "subcommands") {
					this.parseSubcommands(command, value as CLICommand[]);
				}
				if (name === "arguments") {
					this.parseArguments(command, value as JSONCommandAgrument[]);
				}
				if (name === "options") {
					this.parseOptions(command, value as JSONCommandOption[]);
				}
				if (name === "alias") {
					command.aliases(value as string[]);
				}
			}
		}

		return (this.program ?? target).addCommand(command);
	}

	private parseArguments(command: Command, args: JSONCommandAgrument[]) {
		this.__validateArguments(args);

		for (const arg of args) {
			const { name, choices, description, required } = arg;
			const argName = required ? `<${name}>` : `[${name}]`;

			const constructed = new Argument(argName, description);

			if (choices) constructed.choices(choices);
			constructed[required ? "argRequired" : "argOptional"]();

			command.addArgument(constructed);
		}
	}

	private __validateArguments(obj: JSONCommandAgrument[]) {
		// Enforce unique name.
		const uniqueName = new Set(obj.map((i) => i.name));
		if (uniqueName.size !== obj.length) throw new Error("All arguments name must be unique.");

		const hasWhitespace = obj.map((i) => this.Regex.Whitespace.test(i.name));
		const index = hasWhitespace.indexOf(true);
		if (index > -1)
			throw new Error(`Argument name can not have whitespace. Found at '${obj[index].name}'`);

		// Validate arguments order
		let expected = obj.map((i) => i.required).filter(Boolean).length - 1;

		expected = expected < 0 ? 0 : expected;

		obj.forEach((i, index) => {
			if (i.required && (index <= 0 || index > expected))
				throw new Error("Required arguments must be listed before optional arguments.");
		});
	}

	private parseOptions(command: Command, options: JSONCommandOption[]) {
		for (const option of options) {
			const {
				description,
				default: defaultOption,
				choices = [],
				conflictWith = [],
				required,
			} = option;

			const { name, parser } = this._parseOptionType(option);

			const constructed = new Option(name, description);
			constructed.default(defaultOption?.value, defaultOption?.description);

			if (defaultOption?.isPreset && defaultOption.value) constructed.preset(defaultOption.value);

			if (choices.length) constructed.choices(choices);
			if (conflictWith.length) constructed.conflicts(conflictWith);
			if (required) constructed.makeOptionMandatory(required);
			if (parser) constructed.argParser(parser as any);

			command.addOption(constructed);
		}
	}

	private Parser = {
		__formatValue(value: string | undefined, prev: any) {
			value = value ?? prev;

			return value?.trim();
		},

		number: (value: string | undefined, prev: any) => {
			value = this.Parser.__formatValue(value, prev);
			if (!value) return;

			const result = this.Regex.Number.test(value);
			if (!result) throw new InvalidOptionArgumentError("Not a number.");
			return parseFloat(value);
		},
		integer: (value: string | undefined, prev: any) => {
			value = this.Parser.__formatValue(value, prev);
			if (!value) return;

			const result = this.Regex.Integer.test(value);
			if (!result) throw new InvalidOptionArgumentError("Not a integer.");
			return Number(value);
		},
	};

	private Regex = {
		Number: /^[+-]?\d+(\.\d+)?$/,
		Integer: /^[+-]?\d+$/,
		Whitespace: /\s+/g,
	};

	private _parseOptionName(obj: JSONCommandOption) {
		let { name, prefix } = obj;
		prefix = prefix ?? "--";
		if (typeof name === "string") return `${prefix}${name}`;

		return name.map((i) => `${i.prefix ?? prefix}${i.name}`).join(", ");
	}

	private _parseOptionType(obj: JSONCommandOption) {
		const { type, value, required } = obj;

		const name = this._parseOptionName(obj);
		if (!value) return { name: name, parser: undefined };

		let parsedValueName = "";
		let parser: Function = (value: any) => value;

		switch (type) {
			case CommandOptionType.Integer:
				parsedValueName = value.name;
				parser = this.Parser.integer;
				break;
			case CommandOptionType.Number:
				parsedValueName = value.name;
				parser = this.Parser.number;
				break;
			case CommandOptionType.String:
				parsedValueName = value.name;
				break;
			case CommandOptionType.Variadic:
				parsedValueName = `${value.name}...`;
				break;
		}

		if (parsedValueName.length) {
			parsedValueName = required ? `<${parsedValueName}>` : `[${parsedValueName}]`;
		}

		return { name: `${name} ${parsedValueName}`.trim(), parser };
	}

	private parseSubcommands(command: Command, cmds: CLICommand[]) {
		for (const cmd of cmds) {
			this.register(cmd, command);
		}
	}

	public async load(options: CommandLoadOptions) {
		let { commandDir, errors = [], ...pathOptions } = options;

		commandDir = this.handlePathOption(commandDir, pathOptions);
		const filePath = await globPromise(commandDir);

		if (!filePath.length && options?.errors?.includes("NoMatches")) {
			throw new Error(`NoMatches: Pattern ${commandDir} has no matches.`);
		}

		return filePath.map((i) => {
			const name = basename(i);
			if (name.endsWith("d.ts")) return;

			const file = require(i);
			const command = Object.values({ ...file })[0] as Constructable<Command>;

			if (typeof command === "undefined") {
				if (options?.errors?.includes("EmptyFile")) new Error(`File ${name} is empty.`);
			}

			const constructed = Reflect.construct(command, []) as CLICommand;
			return this.register(constructed);
		});
	}

	private handlePathOption(
		path: string,
		options: Pick<CommandLoadOptions, "extensions" | "subfolderDepth" | "root">
	) {
		const { extensions = ["js"], subfolderDepth = 0, root = process.cwd() } = options;

		if (subfolderDepth) {
			const array = new Array(subfolderDepth).fill("**");
			path = join(root, path, ...array);
		}

		path = extensions
			? extensions.length > 1
				? `${path}/*.{${extensions.join(",")}}`
				: `${path}/*.${extensions[0]}`
			: join(path, "*");
		return resolve(path);
	}
}

export type CommandLoadOptions = {
	commandDir: string;
	/**
	 * Accepted file extensions. Default to ['ts'].
	 */
	extensions?: string[];
	subfolderDepth?: number;
	root?: string;
	errors?: CommandLoadError[];
};

export type CommandLoadError = "NoMatches" | "EmptyFile";
