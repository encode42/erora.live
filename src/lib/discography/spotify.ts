import type { SpotifyAlbums, SpotifyTracks } from "$lib/types/discography/spotify";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } from "$env/static/private";
import { debug } from "$lib/debug";

const spotifySdk = SpotifyApi.withClientCredentials(SPOTIFY_CLIENT_ID, SPOTIFY_SECRET);

const spotifyDiscography: SpotifyAlbums = {};
let hasPopulateed: boolean = false;

async function populate() {
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

    hasPopulateed = true;
}

export async function getSpotify() {
    if (!hasPopulateed) {
        await populate();
    }

    return spotifyDiscography;
}
