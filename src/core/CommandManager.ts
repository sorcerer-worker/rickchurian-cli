import type { Command } from "commander";
import { glob } from "glob";
import { basename, join, resolve } from "node:path";
import { promisify } from "node:util";
import type { Constructable } from "../manager/BaseManager";
import type { Command as CLICommand } from "../structures";
import { Parser } from "../structures/";

const globPromise = promisify(glob);

export class CommandManager {
	public program: Command;

	constructor(program: Command) {
		this.program = program;
	}

	/**
	 * Parse a single command to `commander`'s command.
	 */
	public register(cmd: CLICommand, target?: Command) {
		const command = new Parser(cmd).parseCommand();

		return (this.program ?? target).addCommand(command);
	}

	/**
	 * Load commands from directory. Supports recursive load for subdirectories.
	 * Ignore file starting with `.`. You can use this to define subcommands so it doesn't behave like a standalone command.
	 * @param options
	 */
	public async load(options: CommandLoadOptions) {
		let { commandDir, errors = [], ...pathOptions } = options;

		commandDir = this.handlePathOption(commandDir, pathOptions);
		const filePath = await globPromise(commandDir);

		if (!filePath.length && options?.errors?.includes("NoMatches")) {
			throw new Error(`NoMatches: Pattern ${commandDir} has no matches.`);
		}

		return filePath.map((i) => {
			const name = basename(i);
			if (name.startsWith(".")) return;

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
