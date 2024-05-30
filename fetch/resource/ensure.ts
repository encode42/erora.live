import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { log } from "../log";

export const resourcesPath = resolve("resources");
export const orderPath = join(resourcesPath, "order.json");

await ensureDirectory(resourcesPath);
export let order: string[] = await ensureFile(orderPath, []);

export async function updateOrder(current: string[]) {
	order = current;
	await ensureFile(orderPath, current, true);
}

export async function ensureDirectory(path: string) {
	log.debug(`Ensuring the existence of directory "${path}"...`);

	try {
		await access(path);
	} catch {
		await mkdir(path);

		log.debug("Created new directory!");
		return;
	}

	log.debug("...which exists!");
}

export async function ensureFile<T = unknown>(path: string, fallback: T, force = false) {
	log.debug(`Ensuring the existence of file "${path}"...`);

	let fileExists: boolean;
	try {
		await access(path);

		fileExists = true;
	} catch {
		fileExists = false;
	}

	if (!fileExists || force) {
		await writeFile(path, `${JSON.stringify(fallback, undefined, "\t")}\n`);

		log.debug("Created new file with defaults!");
		return fallback;
	}

	const data = await readFile(path, {
		"encoding": "utf-8"
	});

	log.debug("...which exists!");
	return JSON.parse(data);
}
