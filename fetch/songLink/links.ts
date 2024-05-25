import { log } from "../log";
import { spotifyDiscography } from "../spotify/discography";
import type { Links } from "../types/Links";
import { songLinkOrder } from "../types/Links";
import { fetchSongLink } from "./client";

export async function getLinks(uri: string, isTrack: boolean) {
	const links: Links = {};

	const songLink = await fetchSongLink(uri, isTrack);
	if (!songLink) {
		return links;
	}

	for (const platform of songLinkOrder) {
		const songLinkPlatform = songLink.linksByPlatform[platform];
		if (!songLinkPlatform) {
			continue;
		}

		links[platform] = songLinkPlatform.url;
	}

	log.debug(`Found the following links: ${Object.keys(links).join(",")}`);

	return {
		...links,
		"songLink": songLink.pageUrl
	};
}

export async function getLinksFromLabel(album: string, track?: string): Promise<Links> {
	const spotifyAlbum = spotifyDiscography[album];
	if (!spotifyAlbum) {
		log.debug(`Album "${album}" does not exist on Spotify!`);

		return {};
	}

	let uri = spotifyAlbum.uri;

	if (track) {
		const spotifyTrack = spotifyAlbum.tracks[track as keyof typeof spotifyAlbum];
		if (!spotifyTrack) {
			log.debug(`Track "${track}" does not exist on Spotify!`);

			return {};
		}

		uri = spotifyTrack.uri;
	}

	return await getLinks(uri, album === track);
}
