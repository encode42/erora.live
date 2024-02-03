import type { ImageFormat } from "@encode42/bandcamp-fetch";
import type { Sources } from "$lib/types/discography/sources";
import type { Album, FeaturedTrack } from "$lib/types/discography/entries";
import bandcamp from "@encode42/bandcamp-fetch";
import { getSpotify } from "./spotify";
import { getLinks } from "./getLinks";
import { localAlbums } from "$lib/data/discography/local";
import { debug } from "$lib/debug";

export async function getAlbum(url: string, imageFormat: ImageFormat | undefined): Promise<Album | undefined> {
    const debugName = "Album Aggregator";
    debug(debugName, `Fetching information for album URL ${url}...`);

    const albumInfo = await bandcamp.album.getInfo({
        "albumUrl": url,
        "albumImageFormat": imageFormat,
        "includeRawData": true
    });

    const spotifyDiscography = await getSpotify();
    const spotifyAlbum = spotifyDiscography[albumInfo.name];
    const links = spotifyAlbum ? await getLinks(spotifyAlbum.uri, true) : debug(debugName, "Album could not be found on Spotify. Not fetching from song.link.");

    const featuredTracks: FeaturedTrack[] = [];
    if (albumInfo.tracks && albumInfo.name in localAlbums) {
        for (const featuredTrack of localAlbums[albumInfo.name]) {
            const trackUrl = albumInfo.tracks.find(track => track.name === featuredTrack.title)?.url;
            if (!trackUrl) {
                continue;
            }

            debug(debugName, `Fetching information for track URL (within album) ${trackUrl}...`);

            const trackInfo = await bandcamp.track.getInfo({
                "trackUrl": trackUrl,
                "includeRawData": true
            });

            if (!trackInfo.streamUrl) {
                continue;
            }

            let trackLinks: Sources | void | undefined;
            if (links) {
                const spotifyTrack = spotifyAlbum && spotifyAlbum.tracks[trackInfo.name];
                trackLinks = spotifyTrack ? await getLinks(spotifyTrack.uri, true) : debug(debugName, "Track could not be found on Spotify. Not fetching from song.link.");
            }

            featuredTracks.push({
                "title": trackInfo.name,
                "description": {
                    "bandcamp": trackInfo.raw?.basic.description,
                    "why": featuredTrack.why
                },
                "url": {
                    "bandcamp": trackUrl,
                    "stream": trackInfo.streamUrl,
                    ...trackLinks
                },
                "startAt": featuredTrack.startAt,
                "endAt": featuredTrack.endAt
            })
        }
    }

    return {
        "title": albumInfo.name,
        "art": albumInfo.imageUrl,
        "description": albumInfo.raw?.basic.description,
        "url": {
            "bandcamp": url,
            ...links
        },
        featuredTracks,
        "published": new Date(albumInfo.releaseDate ?? 0).getTime(),
        "type": "album"
    }
}
