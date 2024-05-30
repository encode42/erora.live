import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { log } from "../log";

export async function downloadFile(path: string, url: string, force: boolean) {
	let fileExists: boolean;
	try {
		await access(path);

		fileExists = true;
	} catch {
		fileExists = false;
	}

	if (fileExists && !force) {
		log.debug(`File ${path} already exists. Not overwriting.`);
		return await readFile(path);
	}

	log.debug(`Downloading file ${url}...`);

	const response = await fetch(url);
	if (!response.ok) {
		throw `${response.status}: ${response.statusText}`;
	}

	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	await writeFile(path, buffer);

	log.debug("Finished downloading!");

	return buffer;
}

export async function downloadRelease(path: string, coverUrl: string) {
	const coverBuffer = await downloadFile(join(path, "cover.jpg"), coverUrl, true);

	return {
		coverBuffer
	};
}
