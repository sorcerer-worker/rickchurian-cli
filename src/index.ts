import { program } from "commander";
import { CommandManager } from "./core/CommandManager";

const manager = new CommandManager(program);

(async () => {
	const loaded = await manager.load({
		commandDir: `${__filename.includes(".js") ? "dist/commands/" : "src/commands"}`,
		errors: ["EmptyFile", "NoMatches"],
	});

	program
		.name("rickchurian")
		.description(
			"Rick and Morty inspired cli. With multiple cli commands and additional functionality being added."
		)
		.version("0.0.1");

	program.parse(process.argv);
})();
