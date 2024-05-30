import { log } from "../log";
import { parseArgs } from "node:util";

export function parseUrl() {
	const { values } = parseArgs({
		"args": Bun.argv,
		"options": {
			"url": {
				"type": "string"
			}
		},
		"strict": true,
		"allowPositionals": true
	});

	if (!values.url) {
		log.error("\"--url\" must be provided!");
		process.exit(1);
	}

	return values.url;
}
