import { join } from "node:path";
import { downloadFile, downloadRelease } from "../assets/download";
import { log } from "../log";
import type { MetaAlbum, MetaAlbumTrack } from "../types/discography/Album";

export async function downloadAlbumTrack({ parent, release, urls, paths }: MetaAlbumTrack) {
	log.info(`[${parent} -> ${release.label}] Downloading assets`);

	await downloadFile(join(paths.audio, `${release.slug}.mp3`), urls.stream, true);
}

export async function downloadAlbum({ release, paths, urls }: MetaAlbum) {
	log.info(`[${release.label}] Downloading assets`);

	await downloadRelease(paths.release, urls.cover);

	for (const track of release.tracks) {
		await downloadAlbumTrack(track);
	}
}
