import type { AlbumRelease } from "../types/discography/Release";
import type { AlbumTrack } from "../types/discography/Track";
import type { BuiltAlbum, BuiltAlbumTrack } from "../types/discography/BuiltRelease";
import { join } from "node:path";
import { opendir, readFile } from "node:fs/promises";
import { flavors } from "@catppuccin/palette";
import { trim } from "./trim";

export async function buildAlbum(album: AlbumRelease, resourcePath: string, publicPath: string): Promise<BuiltAlbum> {
	const audioPath = join(resourcePath, "audio");

	const tracks: BuiltAlbumTrack[] = [];

	const tracksPath = join(resourcePath, "tracks");
	const tracksDirectory = await opendir(tracksPath);
	for await (const trackFile of tracksDirectory) {
		const trackData = await readFile(join(tracksPath, trackFile.name), {
			"encoding": "utf-8"
		});

		const track = JSON.parse(trackData) as AlbumTrack;
		if (!track.featured) {
			continue;
		}

		trim(audioPath, publicPath, track);

		const { trim: _, featured, ...trimlessTrack } = track;
		tracks.push({
			...trimlessTrack,
			"description": track.description?.split("\n"),
			"why": track.why.split("\n")
		});
	}

	return {
		...album,
		"color": album.color ?? flavors.macchiato.colors.mauve.hex,
		"description": album.description?.split("\n"),
		tracks
	};
}
