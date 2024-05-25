import { hashElement } from "folder-hash";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { log } from "../log";
import { resourcesPath } from "../resource/ensure";

export const completePath = join(resourcesPath, "isComplete");

export async function isComplete(exit = true) {
	let exists: boolean;

	try {
		await access(completePath);

		exists = true;
	} catch {
		if (exit) {
			log.error("Resources do not exist! Run the fetch command first.");
			process.exit(1);
		}

		exists = false;
	}

	if (!exists) {
		return false;
	}

	return await readFile(completePath, {
		"encoding": "utf-8"
	});
}

export async function getHash() {
	const element = await hashElement(resourcesPath, {
		"files": {
			"exclude": ["isComplete"]
		}
	});

	return element.hash;
}
