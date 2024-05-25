import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { string } from "../util/env";

export const client = SpotifyApi.withClientCredentials(string("SPOTIFY_CLIENT_ID"), string("SPOTIFY_SECRET"));
