import type { Album, Track } from "@encode42/bandcamp-fetch";
import { opendir, rm, writeFile } from "node:fs/promises";
import { ImpossibleError } from "../error/ImpossibleError";
import { log } from "../log";
import { resourcesPath, updateOrder } from "../resource/ensure";
import { completePath, getHash } from "../util/isComplete";
import { getAlbum } from "./album";
import { client } from "./client";
import { getTrack } from "./track";

interface Force {
	"force": boolean;
}

interface GetRelease extends Force {
	"release": Album | Track;
}

function wrapProcess<T, Return = void>(process: (options: T) => Promise<Return>) {
	return async (options: T) => {
		await rm(completePath, {
			"force": true
		});

		const result = await process(options);

		const currentHash = await getHash();
		await writeFile(completePath, currentHash);

		return result;
	};
}

export const getRelease = wrapProcess<GetRelease, { "slug": string }>(async ({ release, force }) => {
	if (!release.url) {
		throw new ImpossibleError();
	}

	return await (release.type === "track" ? getTrack : getAlbum)(release.url, force);
});

export const getDiscography = wrapProcess<Force>(async ({ force }) => {
	log.info("Processing Bandcamp discography...");

	const bandcampDiscography = await client.band.getDiscography({
		"bandUrl": "https://erora.bandcamp.com"
	});

	const order: string[] = [];
	for (const bandcampRelease of bandcampDiscography) {
		const release = await getRelease({
			"release": bandcampRelease,
			force
		});

		order.push(release.slug);
	}

	await updateOrder(order);

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

	log.info("Finished processing!");
});
