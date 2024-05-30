import { join } from "node:path";
import { downloadAlbum, downloadAlbumTrack } from "../assets/album";
import { log } from "../log";
import { compareDifference } from "../resource/compare";
import { ensureDirectory, ensureFile } from "../resource/ensure";
import { createRelease, getReleasePaths } from "../resource/release";
import { populateAlbumLinks, populateAlbumTrackLinks } from "../songLink/populate";
import type { MetaAlbum, MetaAlbumTrack } from "../types/discography/Album";

export async function getAlbumPaths(slug: string) {
	const { release } = await getReleasePaths(slug);
	const tracks = join(release, "tracks");
	const audio = join(release, "audio");
	await ensureDirectory(tracks);
	await ensureDirectory(audio);

	const order = join(release, "order.json");
	await ensureFile(order, []);

	return {
		release,
		order,
		tracks,
		audio
	};
}

export async function createAlbum(metaAlbum: MetaAlbum) {
	await populateAlbumLinks(metaAlbum);

	const { release, urls, paths } = metaAlbum;
	const { tracks, ...meta } = release;

	log.info(`[${release.label}] Creating metadata files`);

	await createRelease(meta, urls.cover, paths.release);

	await ensureFile(
		paths.order,
		tracks.map((track) => track.release.slug),
		true
	);

	for (const track of tracks) {
		await createAlbumTrack(track);
	}
}

export async function createAlbumTrack(metaAlbumTrack: MetaAlbumTrack) {
	await populateAlbumTrackLinks(metaAlbumTrack);

	const { parent, release, paths } = metaAlbumTrack;

	log.info(`[${parent} -> ${release.label}] Creating metadata files`);

	const meta = await ensureFile(paths.track, release);
	compareDifference(meta.label, meta, release);
}

export async function processAlbum(meta: MetaAlbum) {
	await createAlbum(meta);
	await downloadAlbum(meta);
}

export async function processAlbumTrack(meta: MetaAlbumTrack) {
	await createAlbumTrack(meta);
	await downloadAlbumTrack(meta);
}
