import type { Track } from "$lib/types/discography/entries";
import type { ImageFormat } from "@encode42/bandcamp-fetch";
import bandcamp from "@encode42/bandcamp-fetch";
import { getSpotify } from "./spotify";
import { getLinks } from "./getLinks";
import { localTracks } from "$lib/data/discography/local";
import { debug } from "$lib/debug";

export async function getTrack(url: string, imageFormat: ImageFormat | undefined): Promise<Track | undefined> {
    const debugName = "Track Aggregator";
    debug(debugName, `Fetching information for track URL ${url}...`);

    const trackInfo = await bandcamp.track.getInfo({
        "trackUrl": url,
        "albumImageFormat": imageFormat,
        "includeRawData": true
    });

    if (!trackInfo.streamUrl) {
        return;
    }

    const spotifyDiscography = await getSpotify();
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
