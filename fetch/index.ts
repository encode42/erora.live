import { format, resolve } from "node:path";
import { log } from "./log";

const commandsPath = resolve("fetch/commands");
const input = Bun.argv[2];

const commandPath = format({
	"dir": commandsPath,
	"name": input,
	"ext": "ts"
});

log.debug(`Importing from "${commandPath}"...`);

const command = await import(commandPath);
if (!command || !("run" in command && typeof command.run === "function")) {
	log.error(`Command "${input}" does not exist!`);
	process.exit(1);
}

const exitCode = await command.run();
process.exit(exitCode ?? 0);
