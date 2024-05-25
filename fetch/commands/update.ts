import { parseArgs } from "node:util";
import { client } from "../bandcamp/client";
import { getRelease } from "../bandcamp/discography";
import { log } from "../log";
import type { Command } from "../types/Command";
import { isComplete } from "../util/isComplete";

export const update: Command = {
	"name": "Update",
	"description": "Update the metadata for a specified release.",
	"run": async () => {
		await isComplete();

		const { values } = parseArgs({
			"args": Bun.argv,
			"options": {
				"url": {
					"type": "string"
				},
				"force": {
					"type": "boolean",
					"default": false
				}
			},
			"strict": true,
			"allowPositionals": true
		});

		if (!values.url) {
			throw "The release URL must be provided!";
		}

		if (values.force) {
			log.warn('"--force" flag is specified! Existing resource data will be overwritten!');
		}

		const bandcampRelease = await client[new URL(values.url).pathname.startsWith("/album/") ? "album" : "track"].getInfo({
			"url": values.url
		});

		await getRelease({
			"release": bandcampRelease,
			"force": values.force ?? false
		});

		process.exit(0);
	}
};
