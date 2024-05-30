import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { downloadAlbum } from "../assets/album";
import { downloadTrack } from "../assets/track";
import { getAlbum } from "../bandcamp/album";
import { getTrack } from "../bandcamp/track";
import { order, resourcesPath } from "../resource/ensure";
import type { Release } from "../types/discography/Release";

export async function run() {
	for (const slug of order) {
		const resourcePath = join(resourcesPath, slug);
		const metaData = await readFile(join(resourcePath, "meta.json"), {
			"encoding": "utf-8"
		});

		const meta = JSON.parse(metaData) as Release;

		if (meta.type === "album") {
			const meta = await getAlbum(`https://erora.bandcamp.com/album/${slug}`);
			await downloadAlbum(meta);
		} else {
			const meta = await getTrack(`https://erora.bandcamp.com/track/${slug}`);
			await downloadTrack(meta);
		}
	}
}
