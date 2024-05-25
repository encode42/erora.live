import { ImpossibleError } from "../error/ImpossibleError";
import { log } from "../log";
import { overrides } from "../overrides/overrides";
import { createAlbum } from "../resource/create";
import { getLinksFromLabel } from "../songLink/links";
import type { AlbumRelease } from "../types/discography/Release";
import type { AlbumTrack } from "../types/discography/Track";
import { client, largeImageFormat } from "./client";
import { getTrackMeta } from "./track";

export async function getAlbum(url: string, force: boolean) {
	log.debug(`Fetching metadata for ${url}...`);

	const bandcampAlbum = await client.album.getInfo({
		"albumUrl": url,
		"albumImageFormat": largeImageFormat,
		"includeRawData": true
	});

	log.info(`Processing album ${bandcampAlbum.name}...`);

	if (!bandcampAlbum.tracks) {
		throw new ImpossibleError();
	}

	if (!bandcampAlbum.imageUrl) {
		throw new ImpossibleError();
	}

	const slug = url.split("/").at(-1) ?? bandcampAlbum.name;
	const links = await getLinksFromLabel(bandcampAlbum.name);

	const album: AlbumRelease = {
		"type": "album",
		slug,
		"released": new Date(bandcampAlbum.releaseDate ?? Date.now()).getTime(),
		"links": {
			"bandcamp": url,
			...links
		},
		"label": bandcampAlbum.name,
		"description": bandcampAlbum.description,
		"tracks": []
	};

	const streamUrls: string[] = [];
	for (const bandcampTrack of bandcampAlbum.tracks) {
		log.info(`→ ${bandcampTrack.name}`);

		if (!bandcampTrack.url) {
			throw new ImpossibleError();
		}

		const trackMeta = await getTrackMeta(bandcampTrack.url);

		const track: AlbumTrack = {
			"slug": trackMeta.slug,
			"links": trackMeta.links,
			"label": trackMeta.label,
			"description": trackMeta.description
		};

		const override = overrides[track.label];
		if (override?.type === "albumTrack") {
			await override.transform({
				"album": album,
				track
			});
		}

		album.tracks.push(track);
		streamUrls.push(trackMeta.streamUrl);
	}

	const override = overrides[album.label];
	if (override?.type === "album") {
		await override.transform({
			album
		});
	}

	await createAlbum({
		album,
		"coverUrl": bandcampAlbum.imageUrl,
		streamUrls,
		force
	});

	log.debug("Album has been processed!");

	return {
		slug
	};
}
