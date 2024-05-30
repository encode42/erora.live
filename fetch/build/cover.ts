import { copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { log } from "../log";
import type { LocalAlbum } from "../types/discography/Album";
import type { LocalTrack } from "../types/discography/Track";

export async function cover({ release, paths }: LocalAlbum | LocalTrack) {
	log.info(`[${release.label}] Converting cover art`);

	const coverPath = join(paths.resource, "cover.jpg");
	await copyFile(coverPath, join(paths.public, "cover.jpg"));

	const cover = await sharp(coverPath)
		.resize(600)
		.avif({
			"effort": 9,
			"chromaSubsampling": "4:2:0"
		})
		.toBuffer();

	await writeFile(join(paths.public, "cover.avif"), cover);

	log.debug("Finished converting!");
}
