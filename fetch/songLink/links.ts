import { getSpotify } from "../spotify/discography";
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

	return {
		...links,
		"songLink": songLink.pageUrl
	};
}

export async function getLinksFromLabel(album: string, track?: string): Promise<Links> {
	const spotifyDiscography = await getSpotify();

	const spotifyAlbum = spotifyDiscography[album];
	if (!spotifyAlbum) {
		return {};
	}

	let uri = spotifyAlbum.uri;

	if (track) {
		const spotifyTrack = spotifyAlbum.tracks[track as keyof typeof spotifyAlbum];
		if (!spotifyTrack) {
			return {};
		}

		uri = spotifyTrack.uri;
	}

	return await getLinks(uri, album === track);
}
