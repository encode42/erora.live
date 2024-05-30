import { flavors } from "@catppuccin/palette";
import { opendir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { trimAlbumTrack } from "../build/trim";
import type { AlbumTrack, BuiltAlbum, BuiltAlbumTrack, LocalAlbum } from "../types/discography/Album";

export async function buildAlbum({ release, paths }: LocalAlbum): Promise<BuiltAlbum> {
	const tracks: BuiltAlbumTrack[] = [];

	let albumDuration = 0;

	const tracksPath = join(paths.resource, "tracks");
	const tracksDirectory = await opendir(tracksPath);
	for await (const trackFile of tracksDirectory) {
		const trackData = await readFile(join(tracksPath, trackFile.name), {
			"encoding": "utf-8"
		});

		const track = JSON.parse(trackData) as AlbumTrack;
		if (!track.featured) {
			continue;
		}

		trimAlbumTrack({
			"parent": release.label,
			"release": track,
			"paths": paths
		});

		const { trim, featured, duration, released, ...trimlessTrack } = track;

		albumDuration += duration;
		tracks.push(trimlessTrack);
	}

	release.duration = Math.round(albumDuration);
	release.color ??= flavors.macchiato.colors.mauve.hex;
	release.tracks = tracks;

	return release;
}
