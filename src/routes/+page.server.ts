import type { ImageFormat } from "bandcamp-fetch";
import type { SpotifyAlbums, SpotifyTracks } from "$lib/types/discography/spotify";
import type { Album, Discography, FeaturedTrack, Track } from "$lib/types/discography/entries";
import type { Sources, StreamSources } from "$lib/types/discography/sources"
import pThrottle from "p-throttle";
import bcfetch, { ImageFormatFilter } from "bandcamp-fetch";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } from "$env/static/private";
import { sources } from "$lib/data/discography/sources";
import { localAlbums } from "$lib/data/discography/local";
import { localTracks } from "../lib/data/discography/local";
import { debug } from "$lib/debug";

const spotifySdk = SpotifyApi.withClientCredentials(SPOTIFY_CLIENT_ID, SPOTIFY_SECRET);
const spotifyDiscography: SpotifyAlbums = {};

async function populateSpotify() {
    const debugName = "Spotify Discography";
    debug(debugName, "Populating Spotify discography entries...");

    const spotifyAlbums = await spotifySdk.artists.albums("52lfuNcFTbrdWz8EssQPCr");

    for (const album of spotifyAlbums.items) {
        const tracks: SpotifyTracks = {};

        debug(debugName, `Fetching tracks for album ${album.name}...`);

        const spotifyTracks = await spotifySdk.albums.tracks(album.id);
        for (const track of spotifyTracks.items) {
            tracks[track.name] = {
                "uri": track.uri
            };
        }

        spotifyDiscography[album.name] = {
            "uri": album.uri,
            tracks
        }
    }
}

async function getAlbum(url: string, imageFormat: ImageFormat | undefined): Promise<Album | undefined> {
    const debugName = "Album Aggregator";
    debug(debugName, `Fetching information for album URL ${url}...`);

    const albumInfo = await bcfetch.album.getInfo({
        "albumUrl": url,
        "albumImageFormat": imageFormat,
        "includeRawData": true
    });

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

            const trackInfo = await bcfetch.track.getInfo({
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
        "type": "album"
    }
}

async function getTrack(url: string, imageFormat: ImageFormat | undefined): Promise<Track | undefined> {
    const debugName = "Track Aggregator";
    debug(debugName, `Fetching information for track URL ${url}...`);

    const trackInfo = await bcfetch.track.getInfo({
        "trackUrl": url,
        "albumImageFormat": imageFormat,
        "includeRawData": true
    });

    if (!trackInfo.streamUrl) {
        return;
    }

    const spotifyTrack = spotifyDiscography[trackInfo.name];
    const links = spotifyTrack ? await getLinks(spotifyTrack.uri, true) : debug(debugName, "Track could not be found on Spotify. Not fetching from song.link.");

    return {
        "title": trackInfo.name,
        "art": trackInfo.imageUrl,
        "description": trackInfo.raw?.basic.description,
        "url": {
            "bandcamp": url,
            "stream": trackInfo.streamUrl,
            ...links
        },
        "type": "track",
        "startAt": localTracks[trackInfo.name]?.startAt ?? 0,
        "endAt": localTracks[trackInfo.name]?.endAt ?? 30
    }
}

const songLinkThrottler = pThrottle({
    "limit": 10,
    "interval": 60000,
    "onDelay": () => {
        debug("song.link Throttler", "Hit song.link ratelimit, delaying requests...");
    }
});

const fetchSongLink = songLinkThrottler(async (uri, isTrack) => {
    const debugName = "song.link Fetcher";
    const songLinkEndpoint = new URL("https://api.song.link/v1-alpha.1/links");
    
    songLinkEndpoint.searchParams.set("url", encodeURIComponent(uri));
    songLinkEndpoint.searchParams.set("songIfSingle", isTrack);

    debug(debugName, `Fetching from ${songLinkEndpoint.toString()}`);

    const request = await fetch(songLinkEndpoint.toString(), {
        "headers": {
            "User-Agent": "encode42/erora.live (me@encode42.dev)"
        }
    });

    if (!request.ok) {
        if (request.status === 404) {
            debug(debugName, "No URLs could be fetched.");
            return;
        }

        throw request.statusText;
    }

    return await request.json();
})

async function getLinks(uri: string, isTrack: boolean): Promise<Sources> {
    const debugName = "Link Aggregator";
    const urls: Sources = {};

    debug(debugName, `Getting streaming URLs from song.link for URL ${uri}...`);

    const songLinks = await fetchSongLink(uri, isTrack);
    if (!songLinks) {
        return urls;
    }

    for (const source of sources) {
        if (!songLinks.linksByPlatform[source]) {
            continue;
        }

        urls[source] = songLinks.linksByPlatform[source].url;
    }

    debug(debugName, `Found the following URLs: ${Object.keys(urls).join(", ")}`);

    return urls;
}

export async function load() {
    await populateSpotify();

    const discography: Discography = [];

    const imageFormats = await bcfetch.image.getFormats(ImageFormatFilter.Album);
    const largeImageFormat = imageFormats.find(format => format.name === "art_app_large");

    const bandcampEntries = await bcfetch.band.getDiscography({
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

    debug("Page Loader", "Done!");

    return {
        discography
    }
}
