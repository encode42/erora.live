import { opendir } from "node:fs/promises";
import { build as runBuild } from "../build/build";
import { log } from "../log";
import { order, resourcesPath } from "../resource/ensure";

export async function run() {
	const directory = await opendir(resourcesPath);
	for await (const entry of directory) {
		if (entry.isFile()) {
			continue;
		}

		if (order.includes(entry.name)) {
			continue;
		}

		log.warn(`Resource "${entry.name}" no longer exists online! It's recommended to remove this directory.`);
	}

	await runBuild();
}
