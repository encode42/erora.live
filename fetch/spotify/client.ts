import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { string } from "../util/env";

let client: SpotifyApi;

export function getClient() {
	if (client) {
		return client;
	}

	client = SpotifyApi.withClientCredentials(string("SPOTIFY_CLIENT_ID"), string("SPOTIFY_SECRET"));
	return client;
}
