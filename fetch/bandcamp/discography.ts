import type { Album, Track } from "@encode42/bandcamp-fetch";
import { log } from "../log";
import { getAlbumPaths } from "../resource/album";
import type { MetaAlbum, MetaAlbumTrack } from "../types/discography/Album";
import type { MetaTrack } from "../types/discography/Track";
import { ImpossibleError } from "../util/ImpossibleError";
import { getAlbum, getAlbumTrack } from "./album";
import { client } from "./client";
import { getTrack } from "./track";

export async function fetchMeta(url: string): Promise<MetaAlbum | MetaTrack | MetaAlbumTrack> {
	log.debug(`Fetching metadata for "${url}" from discography...`);

	const bandcampRelease = await client[new URL(url).pathname.startsWith("/album/") ? "album" : "track"].getInfo({
		url
	});

	if (!bandcampRelease.url) {
		throw new ImpossibleError();
	}

	if (bandcampRelease.type === "track" && bandcampRelease.album) {
		const slug = getSlug(bandcampRelease.album);
		const paths = await getAlbumPaths(slug);

		return await getAlbumTrack(bandcampRelease.url, paths);
	}

	if (bandcampRelease.type === "album") {
		return await getAlbum(bandcampRelease.url);
	}

	return await getTrack(bandcampRelease.url);
}

export function getSlug(release: Album | NonNullable<Track["album"]> | Track) {
	if (!release.url) {
		throw new ImpossibleError();
	}

	const slug = release.url.split("/").at(-1) ?? release.name;

	log.debug(`Detected slug: ${release.url} -> ${slug}`);

	return slug;
}
