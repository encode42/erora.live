import pThrottle from "p-throttle";
import { log } from "../log";
import type { SongLinkResponse } from "../types/songLink/SongLinkResponse";

const songLinkEndpoint = new URL("https://api.song.link/v1-alpha.1/links");

const songLinkThrottler = pThrottle({
	"limit": 10,
	"interval": 60000,
	"onDelay": () => {
		log.warn("Hit song.link rate limit! Delaying requests...");
	}
});

export const fetchSongLink = songLinkThrottler(async (spotifyUri: string, isTrack: boolean): Promise<SongLinkResponse> => {
	log.debug(`Fetching song links for ${spotifyUri}...`);

	songLinkEndpoint.searchParams.set("url", encodeURIComponent(spotifyUri));
	songLinkEndpoint.searchParams.set("songIfSingle", encodeURIComponent(isTrack));

	log.debug(songLinkEndpoint.toString());

	const response = await fetch(songLinkEndpoint.toString(), {
		"headers": {
			"User-Agent": "encode42/erora.live (me@encode42.dev)"
		}
	});

	if (!response.ok) {
		if (response.status === 404) {
			log.warn("No links could be found.");
		}

		throw `${response.status}: ${response.statusText}`;
	}

	const data = await response.json();
	log.debug(`Finished fetching! ${JSON.stringify(data)}`);

	return data;
});
