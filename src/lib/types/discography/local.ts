import type { FeaturedTrack, Track } from "./entries";

export interface LocalTrack {
	"startAt": Track["startAt"];
	"endAt": Track["endAt"];
}

export interface LocalFeaturedTrack {
	"title": FeaturedTrack["title"];
	"why": FeaturedTrack["description"]["why"];
	"startAt": FeaturedTrack["startAt"];
	"endAt": FeaturedTrack["endAt"];
}

export interface LocalTracks {
	[key: string]: LocalTrack;
}

export interface LocalAlbums {
	[key: string]: LocalFeaturedTrack[];
}
