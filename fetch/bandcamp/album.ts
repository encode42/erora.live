import { format } from "node:path";
import { getSlug } from "../bandcamp/discography";
import { log } from "../log";
import { getAlbumPaths } from "../resource/album";
import type { MetaAlbum, MetaAlbumTrack } from "../types/discography/Album";
import { ImpossibleError } from "../util/ImpossibleError";
import { client, largeImageFormat } from "./client";
import { fetchTrackMeta } from "./track";

export async function getAlbumTrack(url: string, paths: MetaAlbum["paths"]): Promise<MetaAlbumTrack> {
	log.debug(`Getting album track from "${url}"...`);

	const { parent, position, release, urls } = await getAlbumTrackMeta(url);

	log.info(`[${parent} -> ${release.label}] Getting metadata`);

	const albumTrack: MetaAlbumTrack = {
		"type": "albumTrack",
		parent,
		position,
		release,
		urls,
		"paths": {
			...paths,
			"track": format({
				"dir": paths.tracks,
				"name": release.slug,
				"ext": "json"
			})
		}
	};

	log.debug("Finished fetching album track!");

	return albumTrack;
}

export async function getAlbum(url: string): Promise<MetaAlbum> {
	log.debug(`Getting album release from "${url}"...`);

	const bandcampAlbum = await client.album.getInfo({
		"albumUrl": url,
		"albumImageFormat": largeImageFormat
	});

	log.info(`[${bandcampAlbum.name}] Getting metadata`);

	if (!bandcampAlbum.tracks) {
		throw new ImpossibleError();
	}

	if (!bandcampAlbum.imageUrl) {
		throw new ImpossibleError();
	}

	const slug = getSlug(bandcampAlbum);
	const paths = await getAlbumPaths(slug);

	const meta: MetaAlbum["release"] = {
		"type": "album",
		slug,
		"released": new Date(bandcampAlbum.releaseDate ?? Date.now()).getTime(),
		"links": {
			"bandcamp": url
		},
		"label": bandcampAlbum.name,
		"description": bandcampAlbum.description?.split("\n"),
		"tracks": []
	};

	for (const bandcampTrack of bandcampAlbum.tracks) {
		if (!bandcampTrack.url) {
			throw new ImpossibleError();
		}

		meta.tracks.push(await getAlbumTrack(bandcampTrack.url, paths));
	}

	const album: MetaAlbum = {
		"type": "album",
		"release": meta,
		"urls": {
			"cover": bandcampAlbum.imageUrl
		},
		"paths": paths
	};

	log.debug("Finished fetching album!");

	return album;
}

export async function getAlbumTrackMeta(url: string) {
	const meta = await fetchTrackMeta(url);

	if (!meta.bandcamp.album || !meta.bandcamp.position) {
		throw new ImpossibleError();
	}

	return {
		"parent": meta.bandcamp.album.name,
		"position": meta.bandcamp.position,
		...meta
	};
}
