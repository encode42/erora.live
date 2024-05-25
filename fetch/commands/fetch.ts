import { parseArgs } from "node:util";
import { getDiscography } from "../bandcamp/discography";
import { log } from "../log";
import type { Command } from "../types/Command";

export const fetch: Command = {
	"name": "Fetch",
	"description": "Fetch, process, and download all relevant resources.",
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

		if (values.force) {
			log.warn('"--force" flag is specified! All existing resource data will be overwritten!');
		}

		await getDiscography({
			"force": values.force ?? false
		});

		process.exit(0);
	}
};
