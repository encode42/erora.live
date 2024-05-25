import { client } from "./client";

interface SpotifyDiscography {
	[album: string]: {
		"uri": string;
		"tracks": {
			[track: string]: {
				"link": string;
				"uri": string;
			};
		};
	};
}

export const spotifyDiscography: SpotifyDiscography = {};

const spotifyAlbums = await client.artists.albums("52lfuNcFTbrdWz8EssQPCr");

for (const spotifyAlbum of spotifyAlbums.items) {
	if (!spotifyDiscography[spotifyAlbum.name]) {
		spotifyDiscography[spotifyAlbum.name] = {
			"uri": spotifyAlbum.uri,
			"tracks": {}
		};
	}

	const spotifyTracks = await client.albums.tracks(spotifyAlbum.id);

	for (const spotifyTrack of spotifyTracks.items) {
		spotifyDiscography[spotifyAlbum.name].tracks[spotifyTrack.name] = {
			"link": spotifyTrack.external_urls.spotify,
			"uri": spotifyTrack.uri
		};
	}
}
