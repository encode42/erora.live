import type { Discography, DiscographyObject } from "$lib/types/discography/entries";
import bandcamp, { ImageFormatFilter } from "@encode42/bandcamp-fetch";
import { getTrack } from "./getTrack";
import { getAlbum } from "./getAlbum";
import { debug } from "$lib/debug";

export async function getDiscography(): Promise<DiscographyObject> {
	const debugName = "Discography Getter";
	debug(debugName, "Getting discography...");

	const discography: Discography = [];

	const imageFormats = await bandcamp.image.getFormats(ImageFormatFilter.Album);
	const largeImageFormat = imageFormats.find((format) => format.name === "art_app_large");

	const bandcampEntries = await bandcamp.band.getDiscography({
		"bandUrl": "https://erora.bandcamp.com"
	});

	for (const entry of bandcampEntries) {
		if (!entry.url) {
			continue;
		}

		const discographyEntry = await (entry.type === "track" ? getTrack : getAlbum)(entry.url, largeImageFormat);
		if (!discographyEntry) {
			continue;
		}

		discography.push(discographyEntry);
	}

	debug(debugName, "Done!");

	return {
		discography,
		"lastUpdate": new Date().getTime()
	};
}
