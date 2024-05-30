import { getSlug } from "../bandcamp/discography";
import { log } from "../log";
import { getTrackPaths } from "../resource/track";
import type { MetaTrack } from "../types/discography/Track";
import { ImpossibleError } from "../util/ImpossibleError";
import { client, largeImageFormat } from "./client";

export async function getTrack(url: string): Promise<MetaTrack> {
	log.debug(`Getting track from release "${url}"...`);

	const { release, urls } = await getTrackMeta(url);

	log.info(`[${release.label}] Getting metadata`);

	const paths = await getTrackPaths(release.slug);

	return {
		"type": "track",
		"release": {
			"type": "track",
			...release,
			"trim": {
				"start": "0:00",
				"duration": 0
			}
		},
		urls,
		paths
	};
}

export async function fetchTrackMeta(url: string) {
	log.debug(`Fetching track metadata for "${url}"...`);

	const bandcampTrack = await client.track.getInfo({
		"trackUrl": url,
		"albumImageFormat": largeImageFormat,
		"includeRawData": true
	});

	if (!bandcampTrack.streamUrl || !bandcampTrack.imageUrl) {
		throw new ImpossibleError();
	}

	const meta = {
		"release": {
			"slug": getSlug(bandcampTrack),
			"released": new Date(bandcampTrack.releaseDate ?? Date.now()).getTime(),
			"duration": bandcampTrack.duration ?? 0,
			"links": {
				"bandcamp": url
			},
			"label": bandcampTrack.name,
			"description": bandcampTrack.description?.split("\n")
		},
		"urls": {
			"stream": bandcampTrack.streamUrlHQ ?? bandcampTrack.streamUrl,
			"cover": bandcampTrack.imageUrl
		},
		"bandcamp": bandcampTrack
	};

	log.debug("Finished fetching track metadata!");

	return meta;
}

export async function getTrackMeta(url: string) {
	return await fetchTrackMeta(url);
}
