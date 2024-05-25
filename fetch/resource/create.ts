import Vibrant from "node-vibrant";
import { access, readFile, writeFile } from "node:fs/promises";
import { format, join } from "node:path";
import { ImpossibleError } from "../error/ImpossibleError";
import { log } from "../log";
import type { AlbumReleaseGetter, Release, TrackReleaseGetter } from "../types/discography/Release";
import { ensureDirectory, ensureFile, resourcesPath } from "./ensure";

async function createFile(dir: string, name: string, url: string, force: boolean) {
	const path = format({
		dir,
		name
	});

	let fileExists: boolean;
	try {
		await access(path);

		fileExists = true;
	} catch {
		fileExists = false;
	}

	if (fileExists && !force) {
		log.debug(`File ${name} already exists. Not overwriting.`);
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

async function create(release: Omit<Release, "tracks">, coverUrl: string, force: boolean) {
	const releasePath = join(resourcesPath, release.slug);
	await ensureDirectory(releasePath);

	const coverBuffer = await createFile(releasePath, "cover.jpg", coverUrl, true);

	const palette = await Vibrant.from(coverBuffer).quality(1).getPalette();
	release.color = palette.Vibrant?.hex ?? Object.values(palette)[0]?.hex;

	const metaPath = join(releasePath, "meta.json");
	const meta = await ensureFile(metaPath, release, force);
	compareDifference(meta.label, meta, release);

	return {
		releasePath
	};
}

export async function createAlbum({ album, coverUrl, streamUrls, force }: AlbumReleaseGetter) {
	const { tracks, ...meta } = album;
	const { releasePath } = await create(meta, coverUrl, force);

	const tracksPath = join(releasePath, "tracks");
	const audioPath = join(releasePath, "audio");
	await ensureDirectory(tracksPath);
	await ensureDirectory(audioPath);

	const orderPath = join(releasePath, "order.json");
	await ensureFile(
		orderPath,
		tracks.map((track) => track.slug),
		force
	);

	for (const [index, track] of tracks.entries()) {
		const trackPath = format({
			"dir": tracksPath,
			"name": track.slug,
			"ext": "json"
		});

		const meta = await ensureFile(trackPath, track, force);
		compareDifference(meta.label, meta, track);

		const streamUrl = streamUrls[index];
		if (!streamUrl) {
			throw new ImpossibleError();
		}

		await createFile(audioPath, `${track.slug}.mp3`, streamUrl, true);
	}
}

export async function createTrack({ track, coverUrl, streamUrl, force }: TrackReleaseGetter) {
	const { releasePath } = await create(track, coverUrl, force);

	await createFile(releasePath, `${track.slug}.mp3`, streamUrl, true);
}

const knownDifferent: string[] = ["featured", "why", "trim"];

function compareDifference(label: string, old: object, current: object) {
	const firstDifference = listDifference(old, current, knownDifferent);
	const secondDifference = listDifference(current, old, [...firstDifference, ...knownDifferent]);

	if (firstDifference.length > 0 || secondDifference.length > 0) {
		log.info(`The above warnings are for "${label}"!`);
	}
}

function listDifference(old: object, current: object, ignoredKeys: string[] = []) {
	const differentKeys: string[] = [];

	for (const [key, value] of Object.entries(old)) {
		if (ignoredKeys.includes(key)) {
			continue;
		}

		const currentValue = current[key as keyof typeof current];

		if (typeof value === "object") {
			if (!currentValue) {
				log.warn(`"${key}" is an object, yet its counterpart is undefined!`);

				differentKeys.push(key);
				continue;
			}

			listDifference(value, currentValue);
			continue;
		}

		if (currentValue === value) {
			continue;
		}

		log.warn(`Discrepancy between existing and current values for "${key}"!`);
		log.warn(JSON.stringify(value));
		log.warn("...is the current value, as compared to:");
		log.warn(JSON.stringify(currentValue ?? "undefined"));

		differentKeys.push(key);
	}

	return differentKeys;
}
