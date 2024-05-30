import Vibrant from "node-vibrant";
import { join } from "node:path";
import { downloadFile } from "../assets/download";
import { log } from "../log";
import { compareDifference } from "../resource/compare";
import type { Release } from "../types/discography/Release";
import { ensureDirectory, ensureFile, resourcesPath } from "./ensure";

// TODO: migrate to Meta types
export async function createRelease(release: Omit<Release, "tracks">, coverUrl: string, path: string) {
	log.debug(`Creating general release files for ${release.label}`);

	const coverBuffer = await downloadFile(join(path, "cover.jpg"), coverUrl, true);
	const palette = await Vibrant.from(coverBuffer).quality(1).getPalette();
	release.color = palette.Vibrant?.hex ?? Object.values(palette)[0]?.hex;

	const metaPath = join(path, "meta.json");
	const meta = await ensureFile(metaPath, release);
	compareDifference(meta.label, meta, release);
}

export async function getReleasePaths(slug: string) {
	const release = join(resourcesPath, slug);
	await ensureDirectory(release);

	return {
		release
	};
}
