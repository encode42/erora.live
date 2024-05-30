import { downloadFile, downloadRelease } from "../assets/download";
import { log } from "../log";
import type { MetaTrack } from "../types/discography/Track";

export async function downloadTrack({ release, urls, paths }: MetaTrack) {
	log.info(`[${release.label}] Downloading assets`);

	await downloadRelease(paths.release, urls.cover);
	await downloadFile(paths.audio, urls.stream, true);
}
