import type { Sources } from "$lib/types/discography/sources";
import pThrottle from "p-throttle";
import { sources } from "$lib/data/discography/sources";
import { debug } from "$lib/debug";

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
});

export async function getLinks(uri: string, isTrack: boolean): Promise<Sources> {
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
