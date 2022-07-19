type Awaitable<T> = T | Promise<T>;

export abstract class Command {
	constructor(options: JSONCommand) {
		this.data = options ?? {};
		this._patch(options);
	}

	abstract execute(options: ResolvedCommandOptions): Awaitable<any>;

	private _patch(options: JSONCommand) {
		this.data.name = options.name;

		if ("options" in options) {
			this.data.options = options.options;
		}

		if ("subcommands" in options) {
			this.data.subcommands = options.subcommands;
		}

		if ("arguments" in options) {
			this.data.arguments = options.arguments;
		}

		if ("description" in options) {
			this.data.description = options.description;
		}
	}

	public parse(data?: JSONCommand) {
		if (!data) data = this.data;

		const {
			arguments: commandArgs = [],
			name,
			aliases = [],
			options = [],
			subcommands = [],
			description,
		} = data ?? {};

		const parsed = {
			name,
			aliases,
			description: description ?? "No description available.",
			action: this.execute,
			arguments: commandArgs,
			options,
			subcommands,
		};

		return parsed;
	}
}

export interface ResolvedCommandOptions {
	arguments: { [key: string]: any };
	options: { [key: string]: any };
}

export interface Command {
	data: JSONCommand;
}

export interface JSONCommand {
	name: string;
	description?: string;
	aliases?: string[];
	arguments?: JSONCommandAgrument[];
	options?: JSONCommandOption[];
	/**
	 * Subcommands for this command.
	 * @warn DO NOT reference own command to this option! This will cause an infinite recursion!
	 */
	subcommands?: Command[];
}

//TODO: strict-ify typings for different type.
export interface JSONCommandOption {
	/**
	 * The name of this option, can accept multiple name.
	 * Prefix priority: `name.prefix` > `option.prefix` > `default`
	 * @example
	 * **Example 1:**
	 * ```
	 * {
	 * 	name: 'test',
	 * 	prefix: '-'
	 * }
	 * ```
	 * This will return the option name as `-test`
	 * On console: `commandName -test`
	 * **Example 2:**
	 * ```
	 * {
	 * 	name: [{
	 * 		name: 'test',
	 * 		prefix: '-'
	 * 	}, {
	 * 		name: 't'
	 * 	}],
	 * 	prefix: '---'
	 * }
	 * ```
	 * This will return the option name as `-test, ---t`
	 * On console: `commandName ---t` or `commandName -test`
	 */
	name: JSONCommandOptionName;
	/**
	 * The description of this option.
	 */
	description?: string;
	/**
	 * The default value to fallback to when no value is specified.
	 */
	default?: {
		value?: string;
		/**
		 * The description of this default value to display on help.
		 */
		description?: string;

		isPreset?: boolean;
	};
	/**
	 * The only valid value the user can choose.
	 */
	choices?: string[];
	/**
	 * The type of this option's value
	 *
	 */
	type: CommandOptionType;

	/**
	 * Not implemented.
	 */
	variadicOptions?: {
		type?: CommandOptionType
		maxInput?: number
		minInput?: number
	}

	/**
	 * The name of this option value.
	 * @example
	 * ```
	 * {
	 * 	name: 'say-hello',
	 * 	valueName: 'user'
	 * }
	 * ```
	 * This returns `--say-hello <user>`
	 */
	valueName?: string;
	/**
	 * Whether this option is required
	 */
	required?: boolean;
	/**
	 * The prefix of this option.
	 * @default '--'
	 * @example
	 * On the option object:
	 * ```
	 * {
	 * 	name: 'test',
	 * 	prefix: '-',
	 * }
	 * ```
	 * The option name will be `-test`
	 */
	prefix?: string;
	/**
	 * A list of option name that when specified concurrently with this option would throw an error.
	 * @example
	 * ```
	 * {
	 * 	name: 'option-one',
	 * 	conflictWith: ['option-two']
	 * }
	 * ```
	 * On console:
	 * `commandName --option-one` => OK
	 * `commandName --option-one --option-two` => Error!
	 * `commandName --option-two` => OK
	 */
	conflictWith?: string[];
	/**
	 * Whether to hide this option from the help output.
	 */
	hidden?: boolean;
}

export type JSONCommandOptionName =
	| string
	| {
			name: string;
			prefix?: string;
	  }[];

export interface JSONCommandAgrument {
	name: string;
	description?: string;
	/**
	 * Whether this agurment is required.
	 */
	required?: boolean;
	/**
	 * The only valid value the user would be able to choose.
	 */
	choices?: string[];
}

export enum CommandOptionType {
	String = "string",
	Number = "number",
	Boolean = "boolean",
	Variadic = "variadic",
	Integer = "integer",
}
