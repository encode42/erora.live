import type { Album } from "./Album";
import type { SingleTrack } from "./Track";

export interface AlbumRelease extends Album {
	"type": "album";
}

export interface TrackRelease extends SingleTrack {
	"type": "track";
}

export type Release = AlbumRelease | TrackRelease;

interface ReleaseGetter {
	"coverUrl": string;
	"force": boolean;
}

export interface AlbumReleaseGetter extends ReleaseGetter {
	"album": AlbumRelease;
	"streamUrls": string[];
}

export interface TrackReleaseGetter extends ReleaseGetter {
	"track": TrackRelease;
	"streamUrl": string;
}
