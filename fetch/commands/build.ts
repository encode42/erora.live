import { parseArgs } from "node:util";
import { build as runBuild } from "../build/build";
import { log } from "../log";
import type { Command } from "../types/Command";
import { getHash, isComplete } from "../util/isComplete";

export const build: Command = {
	"name": "Build",
	"description": "Build and trim files for the frontend.",
	"run": async () => {
		const { values } = parseArgs({
			"args": Bun.argv,
			"options": {
				"force": {
					"type": "boolean",
					"default": false
				}
			},
			"strict": true,
			"allowPositionals": true
		});

		if (!values.force) {
			const hash = await isComplete();
			const currentHash = await getHash();

			if (currentHash === hash) {
				log.info("No resource changes detected. Skipping static build!");
				process.exit(0);
			}
		}

		await runBuild();

		process.exit(0);
	}
};
