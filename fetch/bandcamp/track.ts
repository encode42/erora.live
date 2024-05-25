import { ImpossibleError } from "../error/ImpossibleError";
import { log } from "../log";
import { overrides } from "../overrides/overrides";
import { createTrack } from "../resource/create";
import { getLinksFromLabel } from "../songLink/links";
import type { TrackRelease } from "../types/discography/Release";
import { client, largeImageFormat } from "./client";

export async function getTrack(url: string, force: boolean) {
	const meta = await getTrackMeta(url);

	log.info(`Processing track ${meta.label}...`);

	const track: TrackRelease = {
		"type": "track",
		"slug": meta.slug,
		"released": meta.released,
		"links": meta.links,
		"label": meta.label,
		"description": meta.description,
		"trim": {
			"start": "0:00",
			"duration": 30
		}
	};

	const override = overrides[track.label];
	if (override?.type === "track") {
		await override.transform({
			"track": track
		});
	}

	await createTrack({
		track,
		"coverUrl": meta.coverUrl,
		"streamUrl": meta.streamUrl,
		force
	});

	log.debug("Finished processing track!");

	return {
		"slug": meta.slug
	};
}

export async function getTrackMeta(url: string) {
	log.debug(`Fetching metadata for ${url}...`);

	const bandcampTrack = await client.track.getInfo({
		"trackUrl": url,
		"albumImageFormat": largeImageFormat,
		"includeRawData": true
	});

	if (!bandcampTrack.streamUrl || !bandcampTrack.imageUrl) {
		throw new ImpossibleError();
	}

	const links = await getLinksFromLabel(bandcampTrack.album?.name ?? bandcampTrack.name, bandcampTrack.name);

	const meta = {
		"slug": url.split("/").at(-1) ?? bandcampTrack.name,
		"released": new Date(bandcampTrack.releaseDate ?? Date.now()).getTime(),
		"links": {
			"bandcamp": url,
			...links
		},
		"label": bandcampTrack.name,
		"description": bandcampTrack.description,
		"streamUrl": bandcampTrack.streamUrlHQ ?? bandcampTrack.streamUrl,
		"coverUrl": bandcampTrack.imageUrl
	};

	log.debug(`Fetched metadata! ${JSON.stringify(meta)}`);

	return meta;
}
