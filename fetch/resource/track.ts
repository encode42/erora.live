import { join } from "node:path";
import { downloadTrack } from "../assets/track";
import { log } from "../log";
import { createRelease, getReleasePaths } from "../resource/release";
import { populateTrackLinks } from "../songLink/populate";
import type { MetaTrack } from "../types/discography/Track";

export async function getTrackPaths(slug: string) {
	const { release } = await getReleasePaths(slug);
	const audio = join(release, `${slug}.mp3`);

	return {
		release,
		audio
	};
}

export async function createTrack(metaTrack: MetaTrack) {
	const { release, urls, paths } = metaTrack;

	await populateTrackLinks(metaTrack);

	log.info(`[${release.label}] Creating metadata files`);

	await createRelease(release, urls.cover, paths.release);
}

export async function processTrack(meta: MetaTrack) {
	await createTrack(meta);
	await downloadTrack(meta);
}
